package repository;

import entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Buscar usuario por nombre de usuario
     */
    Optional<User> findByUsername(String username);

    /**
     * Buscar usuario por email
     */
    Optional<User> findByEmail(String email);

    /**
     * Verificar si existe un usuario con ese username
     */
    boolean existsByUsername(String username);

    /**
     * Verificar si existe un usuario con ese email
     */
    boolean existsByEmail(String email);
}