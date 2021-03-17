$(document).ready(function() {
    $(".deleteBtn").click(function() {
        $.ajax({
            type: "DELETE",
            url: "http://localhost:3000/user/delete",
            async: false,
            success: function() {
                alert("Account deleted succesfully")
                window.location.href = 'http://localhost:3000/auth/loginpage'
            },
            error: function(xhr, status, error) {
                alert("server error")
            }
        });
    })
    $(".close").click(function() {
        $("#myModal").css("display", "none");
        $('.modal-header h2').html("");
        $('.modal-body').html("");
        $('.modal-footer').html("");
    });
    $("#email a").click(function() {
        $(".modal").css("display", "block")
        $('.modal-header h2').html("update Email")
        $(".modal-body").append(`<span><label>new email: </label><input></input><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">Save</button>`)
        $(".saveBtn").click(function() {
            if ($(".modal-body input").val() == "")
                return $(".modal-body p").html("الزامی")

            updatedObject = { email: $(".modal-body input").val() }
            $.ajax({
                type: "POST",
                url: `http://localhost:3000/user/update`,
                async: false,
                data: updatedObject,
                success: function(result) {
                    alert("updated successfully")
                    location.reload();
                },
                error: function(xhr, status, error) {
                    if (xhr.status == 409)
                        $(".modal-body p").html("اکانتی با این ایمیل وجود دارد")
                    else
                        alert("خطای سرور");
                }
            });
        })
    })
    $("#gender a").click(function() {
        $(".modal").css("display", "block")
        $('.modal-header h2').html("update Gender")
        $(".modal-body").append(`<span><label>gender: </label><select><option value="male">Male</option><option value="female">Female</option></select><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">Save</button>`)
        $(".saveBtn").click(function() {
            updatedObject = { gender: $(".modal-body select").val() }
            $.ajax({
                type: "POST",
                url: `http://localhost:3000/user/update`,
                async: false,
                data: updatedObject,
                success: function(result) {
                    alert("updated successfully")
                    location.reload();
                },
                error: function(xhr, status, error) {
                    alert("خطای سرور");
                }
            });
        })
    })
    $("#password a").click(function() {
        $(".modal").css("display", "block")
        $('.modal-header h2').html("update Password")
        $(".modal-body").append(`<span><label>old pass: </label><input type="password"></input><p></p></span>
                                <span><label>new pass: </label><input type="password"></input><p></p></span>
                                <span><label>confirm new pass: </label><input type="password"></input><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">Save</button>`)
        $(".saveBtn").click(function() {
            let password = $(".modal-body input:eq(0)").val()
            let newpassword = $(".modal-body input:eq(1)").val()
            let confirmpass = $(".modal-body input:eq(2)").val()
            if (!password)
                return $(".modal-body p:eq(0)").html("الزامی")
            else
                $(".modal-body p:eq(0)").html("")
            if (!newpassword)
                return $(".modal-body p:eq(1)").html("الزامی")
            else if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(newpassword))
                return $(".modal-body p:eq(1)").html("پسوورد باید حداقل 8 کاراکتر شامل حداقل 1 حرف و 1 عدد باشد")
            else if (password == newpassword)
                return $(".modal-body p:eq(1)").html("پسوورد جدید و قدیم یکسان هستند")
            else
                $(".modal-body p:eq(1)").html("")
            if (newpassword != confirmpass)
                return $(".modal-body p:eq(2)").html("پسوورد های وارد شده یکسان نیست")
            else
                $(".modal-body p:eq(2)").html("")
            updatedObject = { password, newpassword }
            $.ajax({
                type: "POST",
                url: `http://localhost:3000/user/update`,
                async: false,
                data: updatedObject,
                success: function(result) {
                    alert("updated successfully")
                    location.reload();
                },
                error: function(xhr, status, error) {
                    if (xhr.status == 404)
                        $(".modal-body p:eq(0)").html("پسوورد وارد شده اشتباه است")
                    else
                        alert("خطای سرور");
                }
            });
        })
    })

})