package dto;

/**
 * DTO para actualizar el perfil del usuario
 */
public class ProfileUpdateRequest {
    private String username;
    private String displayName;
    private String bio;
    private String gender;
    private String favoriteRegion;
    private String language;
    private String avatar;

    public ProfileUpdateRequest() {
    }

    // Getters y Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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