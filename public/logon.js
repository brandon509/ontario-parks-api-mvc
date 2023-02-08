document.querySelector('#logon').addEventListener('click', logon)
document.querySelector('#register').addEventListener('click', register)

async function logon(){
    try{
        document.querySelector('#logonForm').classList.remove('hidden')
        document.querySelector('#registerForm').classList.add('hidden')
    }

    catch(err){
        console.log(err)
    }
}

async function register(){
    try{
        document.querySelector('#registerForm').classList.remove('hidden')
        document.querySelector('#logonForm').classList.add('hidden')
    }

    catch(err){
        console.log(err)
    }
}


