using AuthService.Config;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthService.Services
{
    public class JwtService(IConfiguration _configuration)
    {
        public string GenerateUserToken(string userId)
        {
            var userJwtConfig = _configuration.GetSection("UserJwt").Get<JwtConfig>() ?? throw new InvalidOperationException("UserJwtConfig not found.");
            var claims = new[] {
                    new Claim(JwtRegisteredClaimNames.Sub, userId),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat,
                        new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                        ClaimValueTypes.Integer64),
                    new Claim("role", "user")
                };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(userJwtConfig.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(userJwtConfig.Issuer,
                userJwtConfig.Audience,
                claims,
                expires: DateTime.Now.AddMinutes(userJwtConfig.ExpiryInMinutes),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
