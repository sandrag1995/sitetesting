const siteMap = document.querySelector(".siteMap") as HTMLElement;
const registrationLoginMap = document.querySelector(".userLoginRegister") as HTMLElement;


const registerSubmitButton = document.querySelector("#submitBtn") as HTMLElement;
const usernameInput = document.querySelector(".enterName") as HTMLInputElement;
const userPasswordInput = document.querySelector(".enterPassword") as HTMLInputElement;
const userRepeatPasswordInput = document.querySelector(".repeatPassword") as HTMLInputElement;

const registrationMsg = document.querySelector(".registrationMsg") as HTMLElement;


////////////////////////////REGISTER/////////////////////////////
function errorMessageEmpty():void{
    registrationMsg.innerText = ""
}

registerSubmitButton.onclick = () =>{
    createPostScreen.style.display = "none"
    createPostScreen.innerHTML = ""

    const user = {
        name: usernameInput.value,
        passwordOne: userPasswordInput.value,
        passwordTwo: userRepeatPasswordInput.value
    }

    const options = {
        method: "POST",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify(user)
    }

    fetch("http://167.99.138.67:1111/createaccount", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })

    if (user.name === "" || user.passwordOne === "" || user.passwordTwo === ""){
        registrationMsg.innerText = "You cannot leave empty fields!"
        setTimeout(errorMessageEmpty, 2000)
    } else {

        if (user.passwordOne !== user.passwordTwo) {
            registrationMsg.innerText = "Password does not match!"
            setTimeout(errorMessageEmpty, 2000)
        } else {
            registrationMsg.innerText = "Registration is success!"
            registrationMsg.style.color = "green"

            siteMap.style.display = "block"
            registrationLoginMap.style.display = "none"
        }


    }

}

////////////////////////login screen/////////////////////////////


const userLoginButton = document.querySelector("#loginBtn") as HTMLElement;
const userLoginName = document.querySelector(".loginName") as HTMLInputElement;
const userLoginPassword = document.querySelector(".loginPassword") as HTMLInputElement;

const loginMessage = document.querySelector(".loginMsg") as HTMLElement

function errorMessageLogin(): void {
    loginMessage.innerText = ""
}

userLoginButton.onclick = () => {
    console.log("user login button works")

    const user = {
        name: userLoginName.value,
        password: userLoginPassword.value,
    }

    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(user)
    }

    fetch("http://167.99.138.67:1111/login", options)
        .then(res => res.json())
        .then(data => {
            console.log(data)

            const secretKey = data.secretKey;
            localStorage.setItem("secretKey", secretKey);


            const newData = {
                username: user.name,
                password: user.password,
                secretKey: secretKey,
            };

            localStorage.setItem("userData", JSON.stringify(newData))

        })

    if (user.name === "" || user.password === "") {
        loginMessage.innerText = "You cannot leave empty fields!"
        setTimeout(errorMessageLogin, 2000)
    } else {
        loginMessage.innerText = "Login success!"
        loginMessage.style.color = "green"
        setTimeout(errorMessageLogin, 2000)
        siteMap.style.display = "block"
        registrationLoginMap.style.display = "none"
    }

}


const postField = document.querySelector(".postField") as HTMLElement;
const createPostBtn = document.querySelector(".create") as HTMLElement;

const createPostScreen = document.querySelector(".createPostScreen") as HTMLElement;


type PostType = {
    description: string,
    image: string,
    id: string,
    username: string,
    title: string,
    timestamp: number
}

let posts: PostType[] = []

function appendContainer(url: string) {

    fetch(url)
        .then(res => res.json())
        .then(data => {
            posts = url.includes("getsinglepost") ? [data.data] : data.data

            postField.innerHTML = ""
            posts.map((x, index )=> {

                if(index > 350) return
                postField.innerHTML += `
                <div class="postCard">
                    <img src="${x.image}" alt="">
                    <p class="username"><b>Username:</b>${x.username}</p>
                    <p class="title"><b>Title:</b>${x.title}</p>
                </div>
                `
            })

            const usernames = document.querySelectorAll(".username") as NodeListOf<HTMLElement>

            usernames.forEach(el => {
                el.onclick = (event: any) => {
                    const name: string = event.target.innerText
                    return appendContainer("http://167.99.138.67:1111/getuserposts/"+name)
                }
            })

            const titles = document.querySelectorAll(".title") as NodeListOf<HTMLElement>

            titles.forEach((el, index) => {
                el.onclick = () => {
                    const post = posts[index]
                    return appendContainer(`http://167.99.138.67:1111/getsinglepost/${post.username}/${post.id}`)
                }
            })

        })
}
appendContainer("http://167.99.138.67:1111/getAllPosts")



    ////////////////////////////CREATE A POST SECTION/////////////////


    createPostBtn.onclick = () => {
        createPostScreen.style.display = "flex"

        createPostScreen.innerHTML = `
<label>Enter your title:</label>
    <input type="text" class="titleInput">
    <br/>
    <br/>
     <label>Enter your image url:</label>
    <input type="text" class="imageInput">
    <br/>
    <br/>
    <label>Enter your description:</label>
    <input type="text" class="descriptionField"><br/>
    <br/>
    <p class="createMsg" style="color: red;"></p>
    <button class="mt-3" id="createBtn">Post!</button>
    `

        const createPostBtn = document.querySelector("#createBtn") as HTMLElement;
        const titleInput = document.querySelector(".titleInput") as HTMLInputElement;
        const imageInput = document.querySelector(".imageInput") as HTMLInputElement;
        const descriptionInput = document.querySelector(".descriptionField") as HTMLInputElement;

        const createMsg = document.querySelector(".createMsg") as HTMLElement

        function errorMessageCreate(): void {
            createMsg.innerText = ""
        }

        createPostBtn.onclick = () => {

            const secretKey = localStorage.getItem("secretKey");

            const post = {
                secretKey: secretKey,
                title: titleInput.value,
                image: imageInput.value,
                description: descriptionInput.value
            }

            if (post.title === "" || post.image === "" || post.description === "") {
                createMsg.innerText = "You can't leave empty fields!"
                setTimeout(errorMessageCreate, 2000)
            } else {

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(post),
                };

                fetch("http://167.99.138.67:1111/createpost", options)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);

                        const createdPost = {
                            id: secretKey,
                            secretKey: secretKey,
                            title: titleInput.value,
                            image: imageInput.value,
                            description: descriptionInput.value
                        }

                        localStorage.setItem("postedPosts", JSON.stringify(createdPost));
                    })

                postField.innerHTML += `<div class="postCard" id="${post.secretKey}">
<img src="${post.image}" alt="">
<p><b>Title:</b> ${post.title}</p>
<p><b>Description:</b> ${post.description}</p>
</div>`

            }

        }

    }


    const logOutButton = document.querySelector(".logOutBtn") as HTMLElement;

logOutButton.onclick = () =>{
    localStorage.removeItem("secretKey");
    siteMap.innerHTML = ""
    siteMap.style.display = "none"
    registrationLoginMap.style.display = "flex"

}



// registerSubmitButton.onclick = () => {
//     const user = {
//         name: "Andrius112",
//         passwordOne: 'asdasd',
//         passwordTwo: "asdasd"
//     }
//
//     const options = {
//         method: "POST",
//         headers: {
//             "content-type":"application/json"
//         },
//         body: JSON.stringify(user)
//     }
//
//     fetch("http://167.99.138.67:1111/createaccount", options)
//         .then(res => res.json())
//         .then(data => {
//             console.log(data)
//         })
// }

