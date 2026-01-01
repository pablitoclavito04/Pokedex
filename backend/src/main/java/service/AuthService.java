package service;

import dto.AuthResponse;
import dto.LoginRequest;
import dto.ProfileUpdateRequest;
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
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPais(request.getPais());
        user.setFechaNacimiento(request.getFechaNacimiento());
        user.setRole("USER");
        user.setEnabled(true);
        user.setDisplayName(request.getUsername()); // Por defecto, displayName = username
        user.setFavoriteRegion("Kanto");
        user.setLanguage("Español");

        // Guardar usuario
        userRepository.save(user);

        // Generar token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // Retornar respuesta con todos los datos del perfil
        return new AuthResponse(
            token,
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getDisplayName(),
            user.getBio(),
            user.getGender(),
            user.getFavoriteRegion(),
            user.getLanguage(),
            user.getAvatar()
        );
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

        // Retornar respuesta con todos los datos del perfil
        return new AuthResponse(
            token,
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getDisplayName(),
            user.getBio(),
            user.getGender(),
            user.getFavoriteRegion(),
            user.getLanguage(),
            user.getAvatar()
        );
    }

    /**
     * Actualizar perfil del usuario
     */
    public AuthResponse updateProfile(String currentUsername, ProfileUpdateRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar username si se proporciona uno nuevo
        if (request.getUsername() != null && !request.getUsername().equals(currentUsername)) {
            // Verificar que el nuevo username no esté en uso
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("El nombre de usuario ya está en uso");
            }
            user.setUsername(request.getUsername());
        }

        // Actualizar campos del perfil
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getFavoriteRegion() != null) {
            user.setFavoriteRegion(request.getFavoriteRegion());
        }
        if (request.getLanguage() != null) {
            user.setLanguage(request.getLanguage());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        // Guardar cambios
        userRepository.save(user);

        // Generar nuevo token con el username actualizado
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        // Retornar respuesta actualizada
        return new AuthResponse(
            token,
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getDisplayName(),
            user.getBio(),
            user.getGender(),
            user.getFavoriteRegion(),
            user.getLanguage(),
            user.getAvatar()
        );
    }

    /**
     * Eliminar cuenta de usuario
     */
    public void deleteAccount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        userRepository.delete(user);
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