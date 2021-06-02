
const cards = document.querySelectorAll('.recipe-card')

for (let card of cards) {
    card.addEventListener("click", function() {
        const recipeId = card.getAttribute("id")
        if (window.location.href.includes('home')) {
            window.location.href = `recipes/${recipeId}`
        } else {
            window.location.href = `home/recipes/${recipeId}`
        }
    })
}

const chefCards = document.querySelectorAll('.chefs-cards')

console.log(chefCards);

for (let card of chefCards) {
    card.addEventListener("click", function() {
        const chefId = card.getAttribute("id")
            window.location.href = `chefs/${chefId}`
        }
    )
}

// SPOILERS

const spoilerButtons = document.querySelectorAll('.spoiler-button')
const spoilerContent = document.querySelectorAll('.spoiler-content')

for (let spoilerButton of spoilerButtons) {
   const btnId = spoilerButton.getAttribute('id')
    spoilerButton.addEventListener("click", function(){
        console.log(spoilerContent[btnId])
        if (spoilerContent[btnId].classList.contains('hide')) {
            spoilerContent[btnId].classList.remove('hide')
            spoilerButton.innerHTML = "Esconder"
        } else {
            spoilerContent[btnId].classList.add('hide')
            spoilerButton.innerHTML = "Mostrar"
        }
    })
}

// MENU ATIVO

const currentPage = location.pathname
const siteMenuItems = document.querySelectorAll(".links a")
const adminMenuItems = document.querySelectorAll(".admin-header a")

function menuAtivo(menu) {
    for (item of menu) {
        if (currentPage.includes(item.getAttribute("href"))) {
            item.classList.add("active")
        }
    }
}

menuAtivo(siteMenuItems)
menuAtivo(adminMenuItems)

// TO-DO DO FORMULARIO

const Spoilers = {
    addIngredient() {
        const ingredients = document.querySelector("#ingredients");
        const fieldContainer = document.querySelectorAll(".ingredient");
      
        // Realiza um clone do último ingrediente adicionado
        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
      
        // Não adiciona um novo input se o último tem um valor vazio
        if (newField.children[0].value == "") return false;
      
        // Deixa o valor do input vazio
        newField.children[0].value = "";
        ingredients.appendChild(newField);
      },
    addStep() {
        const steps = document.querySelector("#steps");
        const fieldContainer = document.querySelectorAll(".step");
        
        // Realiza um clone do último step adicionado
        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
        
        // Não adiciona um novo input se o último tem um valor vazio
        if (newField.children[0].value == "") return false;
        
        // Deixa o valor do input vazio
        newField.children[0].value = "";
        steps.appendChild(newField);
    }
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target

        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)
            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)

            }
 
            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())
        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode
        
        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id}, `
            } 
        }

        photoDiv.remove()
    }
}


const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        // Lightbox.image.src = target.src
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErros(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error) Validate.displayError(input)

    },
    displayError(input) {
        const inputError = document.querySelector('input')
        inputError.classList.add('inputError')
    },
    clearErros(input) {
        const errorDiv = input.parentNode.querySelector(".error")
        if (errorDiv) errorDiv.remove()
    },
    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) error = "Email invalido"

        return {
            error,
            value
        }
    }

}