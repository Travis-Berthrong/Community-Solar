using AuthService.Data;
using AuthService.Models;
using Microsoft.AspNetCore.Identity;

namespace AuthService.Services
{
    public class UserService(UserManager<User> _userManager)
    {
        public async Task CreateUser(User user, string password)
        {
            await _userManager.CreateAsync(user, password);
        }


    }
}
