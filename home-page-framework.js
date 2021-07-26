;
let modalReferences = {
    wrapper: null,
    modal: null,
    close: null
}

let settings = {
    callbackMapper: null
}

openModal = function() {
    modalReferences.wrapper.style.display = "flex";
}

closeModal = function() {
    while (modalReferences.modal.childNodes.length > 1) {
        modalReferences.modal.lastChild.remove();
    }
    modalReferences.wrapper.style.display = "none";
}

setupModalDOM = function() {
    modalReferences.wrapper = document.createElement('div');
    modalReferences.wrapper.id = 'modal_wrapper';

    modalReferences.modal = document.createElement('div');
    modalReferences.modal.id = 'modal';
    
    modalReferences.close = document.createElement('div');
    modalReferences.close.id = 'modal_close';
    modalReferences.close.innerHTML = '✕';
    modalReferences.close.addEventListener('click', closeModal);

    modalReferences.modal.appendChild(modalReferences.close);
    modalReferences.wrapper.appendChild(modalReferences.modal);
    document.body.appendChild(modalReferences.wrapper)
}

loadModal = function(parrentWrapper, settingsSetup, callbackMapper) {
    setupModalDOM();
    window.addEventListener('keypress', function (e) {
        if (e.code == 'Escape' || e.code == 'Esc' || (e.code = "KeyQ" && (e.ctrlKey || e.altKey))) {
            closeModal();
        }
    });
    settings.callbackMapper = callbackMapper;
    parrentWrapper.appendChild(createListForMenu(settingsSetup.menu));
}

createLine = function(lineDescription) {
    let hr = document.createElement('hr');
    hr.setAttribute('width', lineDescription.width)
    return hr;
};

createLinkInItem = function(link) {
    var li = document.createElement("li");
    var a = document.createElement("a");

    a.href = link.href;

    if (link.imgSrc != undefined) {
        a.innerHTML = `<img src="${link.imgSrc}"/>${link.title}`;
        //li.innerHTML = ``;
        a.className = 'link-with-image';
    } else {
        a.text = link.title;
    }
    li.appendChild(a);
    return li;
};

createItem = function(item) {
    if (item.type == 'link') {
        return createLinkInItem(item);
    }
    if (item.type == 'modal') {
        return createModalInItem(item);
    }
    if (item.type == 'line') {
        return createLine(item);
    }
};

createListForMenu = function(menu) {
    var ul = document.createElement("ul");
    for (let item in menu) {
        domItem = createItem(menu[item]);
        ul.appendChild(domItem);
    }
    return ul;
};

createInput = function(input) {
    addTextFieldWithActionButton = function(placeholder, buttonText, handler) {
        addTextField = function(placeholder) {
            var field = document.createElement("input");
            field.type='text';
            field.setAttribute("autofocus", "true");
            field.placeholder = placeholder;
            return field;
        };

        addButtonLinkedToTextField = function(text, textField, handler) {
            var button = document.createElement("button");
            button.textContent = text;
            button.addEventListener('click', function(){
                handler(textField.value);
            });
            return button;
        };
        let field = addTextField(placeholder);
        field.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handler(field.value);
            }
        });
        let button = addButtonLinkedToTextField(buttonText, field, handler);

        return {
            field: field,
            button: button
        };
    };

    return addTextFieldWithActionButton(input.placeholder, input.buttonTitle, settings.callbackMapper[input.callbackId]);
};

createModalInItem = function(modal) {
    var li = document.createElement("li");

    const isModalMenu = modal.modal.menu != undefined;
    const isModalInput = modal.modal.input != undefined;

    var a = document.createElement("a");
    a.onclick = function() {
        openModal();
        if (isModalMenu) {
            let innerMenu = createListForMenu(modal.modal.menu);
            modalReferences.modal.appendChild(innerMenu);
            return;
        }
        if (isModalInput) {
            let innerInput = createInput(modal.modal.input);
            modalReferences.modal.appendChild(innerInput.field);
            modalReferences.modal.appendChild(innerInput.button);
            return;
        }
    }
    a.innerHTML = `${modal.text}`;

    li.style = 'position: relative;'
    li.innerHTML = `<i class="fas ${isModalMenu ? 'fa-book-open' : 'fa-keyboard'}" style="margin-left: -25px; margin-top: 2px; font-size: 14px; position: absolute;"></i>`;
    li.appendChild(a);
    return li;
};

// ABOVE IS OK