
// using Microsoft.EntityFrameworkCore;
// // using TodoApi;
// using ToDoDbContext = TodoApi.ToDoDbContext;
// using Task = TodoApi.Task;

// var builder = WebApplication.CreateBuilder(args);
// builder.Services.AddDbContext<ToDoDbContext>();

// // הוספת CORS
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAllOrigins",
//         builder => builder.AllowAnyOrigin()
//                           .AllowAnyMethod()
//                           .AllowAnyHeader());
// });
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// var app = builder.Build();
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }
// app.UseCors("AllowAllOrigins");

// app.MapGet("/task/{id}", async (ToDoDbContext db, int id) => {
//     var task = await db.Tasks.FindAsync(id);
//     return task != null ? Results.Ok(task) : Results.NotFound();
// });



// app.MapGet("/task", async (ToDoDbContext db) =>{
// var a= await db.Tasks.ToListAsync();
// return Results.Ok(a);
// });

// app.MapPost("/task", async ( ToDoDbContext db, Task newTask) => {
//     await db.Tasks.AddAsync(newTask);
//     await db.SaveChangesAsync();
//     return Results.Created($"/task/{newTask.Id}", newTask);
// });


// app.MapPut("/task/{id}", async (ToDoDbContext db, int id, Task task,bool isComplete) =>
// {
//     if (id != task.Id)
//     {
//         return Results.BadRequest("Id mismatch");
//     }
//     task.IsComplete = isComplete;
//     db.Tasks.Update(task);
//     await db.SaveChangesAsync();
//     return Results.Ok(task);
// }); 


// app.MapDelete("/task/{id}", async (ToDoDbContext db, int id) =>
// {
//     var task = await db.Tasks.FindAsync(id);

// Console.WriteLine($"Task ID: {task.Id}, IsComplete: {task.IsComplete}");

//     if (task is null) return Results.NotFound();

//     db.Tasks.Remove(task);
//     await db.SaveChangesAsync();

//     return Results.Ok();
// });

// app.Run();
///-----------------------------------------------------------
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using TodoApi;
using ToDoDbContext = TodoApi.ToDoDbContext;
using Task = TodoApi.Task;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("sys"), 
    new MySqlServerVersion(new System.Version(8, 0, 33))));

// הוספת CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigins");

// הגדרת ה-routes
app.MapGet("/tasks", async (ToDoDbContext db) =>
{
    var tasks = await db.Tasks.ToListAsync(); 
    return Results.Ok(tasks);
});

app.MapPost("/tasks", async (ToDoDbContext db, Task newTask) =>
{
    db.Tasks.Add(newTask);
    await db.SaveChangesAsync();
    return Results.Created($"/tasks/{newTask.Id}", newTask);
});

app.MapPut("/tasks/{id}", async (int id, ToDoDbContext db, Task updatedTask) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();

    task.Name = updatedTask.Name;
    task.IsComplete = updatedTask.IsComplete;
    await db.SaveChangesAsync();

    return Results.NoContent(); // אם עדכנו בהצלחה
});

app.MapDelete("/tasks/{id}", async (int id, ToDoDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();

    db.Tasks.Remove(task);
    await db.SaveChangesAsync();

    return Results.NoContent(); // אם מחקנו בהצלחה
});

// הפעלת האפליקציה
app.Run();


