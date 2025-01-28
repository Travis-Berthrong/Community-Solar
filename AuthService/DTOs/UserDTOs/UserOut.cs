using AuthService.Models;

namespace AuthService.DTOs.UserDtos
{
    public class UserOut
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? EmailConfirmed { get; set; }
        public bool? PhoneNumberConfirmed { get; set; }
        public bool? TwoFactorEnabled { get; set; }

        public UserOut(User user)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Email = user.Email;
            PhoneNumber = user.PhoneNumber;
            EmailConfirmed = user.EmailConfirmed;
            PhoneNumberConfirmed = user.PhoneNumberConfirmed;
            TwoFactorEnabled = user.TwoFactorEnabled;
        }
    }
}
