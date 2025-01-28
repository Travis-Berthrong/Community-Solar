using System.ComponentModel.DataAnnotations;
using AuthService.Validators;

namespace AuthService.DTOs.UserDtos
{
    public class UserIn
    {
        [Required]
        public required string FirstName { get; set; }
        [Required]
        public required string LastName { get; set; }
        [Required, EmailAddress]
        public required string Email { get; set; }
        [Required, Phone]
        public required string PhoneNumber { get; set; }

        [Required, PasswordStrengthValidator]
        public required string Password { get; set; }

        [Required]
        public required string Address { get; set; }
    }
}
