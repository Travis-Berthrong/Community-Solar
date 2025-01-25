
using System.Text;
using AuthService.Config;
using AuthService.Data;
using AuthService.Models;
using AuthService.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


namespace AuthService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var authConnectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'AuthContextConnection' not found.");
            builder.Services.AddDbContext<AuthDBContext>(options => options.UseNpgsql(authConnectionString));
            builder.Services.AddDefaultIdentity<User>(options => options.User.RequireUniqueEmail = true).AddEntityFrameworkStores<AuthDBContext>();

            var userJwtConfig = builder.Configuration.GetSection("UserJwt").Get<JwtConfig>() ?? throw new InvalidOperationException("UserJwtConfig not found.");
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
                options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = userJwtConfig.Issuer,
                        ValidAudience = userJwtConfig.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(userJwtConfig.Key))
                    };
                });

            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<JwtService>();

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
