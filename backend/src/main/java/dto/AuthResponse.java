package dto;

/**
 * DTO para respuesta de autenticación
 */
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private String message;
    
    // Campos de perfil
    private String displayName;
    private String bio;
    private String gender;
    private String favoriteRegion;
    private String language;
    private String avatar;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, String email, String role) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public AuthResponse(String token, String username, String email, String role,
                        String displayName, String bio, String gender, 
                        String favoriteRegion, String language, String avatar) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.displayName = displayName;
        this.bio = bio;
        this.gender = gender;
        this.favoriteRegion = favoriteRegion;
        this.language = language;
        this.avatar = avatar;
    }

    public AuthResponse(String message) {
        this.message = message;
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getFavoriteRegion() {
        return favoriteRegion;
    }

    public void setFavoriteRegion(String favoriteRegion) {
        this.favoriteRegion = favoriteRegion;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}