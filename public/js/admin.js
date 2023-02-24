const accept = document.querySelectorAll('.fa-square-check')
Array.from(accept).forEach(x => x.addEventListener('click', acceptUser))

const remove = document.querySelectorAll('.fa-xmark')
Array.from(remove).forEach(x => x.addEventListener('click', removeUser))

document.querySelector('#logBtn').addEventListener('click',logOut)

async function acceptUser(){
    const userId = this.parentNode.childNodes[1].dataset.id
    try{
        const res = await fetch('/admin/approve', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId
            })
        })
        
        const data = await res.json()
        console.log(data)

        location.reload()
        console.log(userId)
    }

    catch(err){
        console.log(err)
    }
}

async function removeUser(){
    const userId = this.parentNode.childNodes[1].dataset.id
    try{
        const res = await fetch('/admin/delete', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: userId
            })
        })

        const data = res.json()
        console.log(data)

        location.reload()
    }

    catch(err){
        console.log(err)
    }
}

async function logOut(){
    try{
        window.location.assign('/')
    }

    catch(err){
        console.log(err)
    }
}

