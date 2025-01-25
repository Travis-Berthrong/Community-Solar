using System.ComponentModel.DataAnnotations;

namespace AuthService.DTOs.User
{
    public class UserLogin
    {
        [Required, EmailAddress]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
