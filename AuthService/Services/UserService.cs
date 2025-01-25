using AuthService.Data;
using AuthService.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthService.Services
{
    public class UserService(UserManager<User> _userManager)
    {
        public async Task<bool> CreateUser(User user, string password)
        {
            var res = await _userManager.CreateAsync(user, password);
            if (!res.Succeeded)
            {
                return false;
            }
            return true;
        }

        public async Task<string?> CheckUserCredentials(string email, string password)
        {
            string normalizedEmail = email.ToUpper();
            var user = await _userManager.FindByEmailAsync(normalizedEmail);
            if (user == null)
            {
                return null;
            }
            bool isValid = await _userManager.CheckPasswordAsync(user, password);
            if (!isValid)
            {
                return null;
            }
            return user.Id;
        }

        public async Task<User?> GetUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user;
        }


    }
}
