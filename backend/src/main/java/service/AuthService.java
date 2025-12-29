package service;

import dto.AuthResponse;
import dto.LoginRequest;
import dto.RegisterRequest;
import entity.User;
import repository.UserRepository;
import util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Lazy;

/**
 * Servicio de autenticación
 */
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Registrar nuevo usuario
     */
    public AuthResponse register(RegisterRequest request) {
        // Validar que no exista el username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya está en uso");
        }

        // Validar que no exista el email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está en uso");
        }

        // Validar campos obligatorios
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new RuntimeException("El username es obligatorio");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
        }

        if (request.getEmail() == null || !request.getEmail().contains("@")) {
            throw new RuntimeException("El email no es válido");
        }

        // Crear nuevo usuario
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encriptar contraseña
        user.setEmail(request.getEmail());
        user.setPais(request.getPais());
        user.setFechaNacimiento(request.getFechaNacimiento());
        user.setRole("USER"); // Rol por defecto
        user.setEnabled(true);

        // Guardar usuario
        userRepository.save(user);

        // Generar token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // Retornar respuesta
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole());
    }

    /**
     * Iniciar sesión
     */
    public AuthResponse login(LoginRequest request) {
        // Buscar usuario
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario o contraseña incorrectos"));

        // Verificar que el usuario esté habilitado
        if (!user.getEnabled()) {
            throw new RuntimeException("La cuenta está deshabilitada");
        }

        // Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }

        // Generar token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // Retornar respuesta
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole());
    }

    /**
     * Validar token
     */
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    /**
     * Extraer username del token
     */
    public String getUsernameFromToken(String token) {
        return jwtUtil.extractUsername(token);
    }

    /**
     * Extraer rol del token
     */
    public String getRoleFromToken(String token) {
        return jwtUtil.extractRole(token);
    }
}