//MedeaJS
let currentModal = null,
modalFocusElement = [],
previousFocused = null;
focusElement = "a, button, input, textarea";

const openModal = function(e){
    e.preventDefault();
    //le modal a ouvrir est celui ayant l'id correspondant au href du lien cliqué. Pour cela l'attribut href doit être precédé de '#'
    console.log(e.target);
    currentModal = $(e.target.getAttribute('data-modal'));
    currentModal.css('display', 'flex');
    $('body').css('overflow', 'hidden');
    currentModal.attr('aria-hidden', false);
    currentModal.attr('aria-modal', true);
    currentModal.click(closeModal);
    $('.js-modal-close').click(closeModal);
    $('.modal-wrapper').click(stopPropagation);
    modalFocusElement = Array.from(currentModal.find(focusElement));
    previousFocused = $(':focus');
    if(modalFocusElement.length>0) modalFocusElement[0].focus();
}

const closeModal = function(e){
    e.preventDefault();
    currentModal.css('display', 'none');
    $('body').css('overflow', 'visible');
    currentModal.attr('aria-hidden', true);
    currentModal.attr('aria-modal', false);
    currentModal.off('click', closeModal);
    $('.js-modal-close').off('click', closeModal);
    $('.modal-wrapper').off('click', stopPropagation);
    currentModal = null;
    previousFocused.focus();
}

const focusInModal = function(e){
    e.preventDefault();
}

const stopPropagation = function(e){
    e.stopPropagation();
}
$('.js-modal-open').each(function(){
    $(this).on('click', function(e){
        openModal(e)
    });
});

$(window).keydown(function(e){
    switch(e.which){
        case 27 :
            closeModal(e);
        break;
        case  9:
            if(currentModal !== null) focusInModal(e);
        break;
    }
})
