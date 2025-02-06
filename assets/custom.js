document.addEventListener("DOMContentLoaded", function () {

  document.addEventListener("theme:loading:end", (event) => {
    setTimeout(function(){
      let e = new Event('resize');    
      window.dispatchEvent(e);            
    }, 1500); 
  });

  document.addEventListener("cart:refresh", (event) => {
    setTimeout(function(){
      let e = new Event('resize');    
      window.dispatchEvent(e);            
    }, 1500); 
  });
  
  function adjustAvadaLists() {
    const klaviyoRegex = new RegExp('static.klaviyo.com', 'i');
    
    // Check if 'static.klaviyo.com' is in the blacklist
    // const klaviyoIndex = window.AVADA_SPEED_BLACKLIST.findIndex(regex => klaviyoRegex.test(regex.source));
  
    //if (klaviyoIndex !== -1) {
      // Remove 'static.klaviyo.com' from the blacklist
      //window.AVADA_SPEED_BLACKLIST.splice(klaviyoIndex, 1);
  
      // Add 'static.klaviyo.com' to the whitelist
      //window.AVADA_SPEED_WHITELIST.push(klaviyoRegex);
    //}
  }
  
  // Call the function to adjust the lists
  adjustAvadaLists();
  
  function updateCollectionProductHeight() {
    // Change complete look value
    document.querySelectorAll(".complete_look_product_wrap .complete_look_product_select").forEach(function(select) {
      select.addEventListener("change", function() {
        const parent = this.closest('.complete_look_product_wrap');
        parent.querySelector(".complete_look_product_add_to_cart .complete_look_product_add_to_cart_val").value = this.value;
      });
    });

    let collectionProHeight = document.querySelector(".ProductItem__ImageWrapper").offsetHeight;
    console.log("height---", collectionProHeight);

    let collectionProHeightMobile = document.querySelector(".flickity-viewport").offsetHeight;
    console.log("mobile height---", collectionProHeightMobile);

    const bannerWrap = document.querySelector(".large_banner_collection_wrap .AspectRatio");
    
    if (collectionProHeight === 0 && collectionProHeightMobile > 0) {
      bannerWrap.style.height = collectionProHeightMobile + 'px';
    } else if (collectionProHeight > 0 && collectionProHeightMobile === 0) {
      bannerWrap.style.height = collectionProHeight + 'px';
    } else if (collectionProHeight < collectionProHeightMobile) {
      bannerWrap.style.height = collectionProHeightMobile + 'px';
    }

    initLookBooks();
    initProductCards();
    
  }

  // Call the function initially
  //updateCollectionProductHeight();
  initLookBooks();
  initProductCards();
  // Set up the MutationObserver
  const targetNode = document.getElementById('Dexter_Loop');
  const config = { attributes: true, attributeFilter: ['class'] };
  setupMutationObserver(targetNode, config, handleClassChange); 

  const sidebarCartNode = document.getElementById('cart-drawer');
  const sidebarCartConfig = { attributes: true, attributeFilter: ['aria-hidden'] }; 
  setupMutationObserver(sidebarCartNode, sidebarCartConfig, handleAriaHiddenChanges); 

  function setupMutationObserver(target, config, callback) {
    if (target) {
      const observer = new MutationObserver(callback);
      observer.observe(target, config);      
    }
  }

  function handleClassChange(mutationsList) {    
    mutationsList.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        updateCollectionProductHeight();
      }
    });
  }

  function handleAriaHiddenChanges(mutationsList) {    
    mutationsList.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
        initLookBooks();        
      }
    });
  }

});

document.addEventListener('AjaxScroll', function() {
  console.log('[CustomJs] Ajax Scroll Event!');
  reinitCollectionProductSlider();
});

const resizeQuickViewSlider = () => {
  document.querySelectorAll('.QuickyBuyPopup .Carousel').forEach(function(obj) {
    obj.dispatchEvent(new Event('resize'));
  });  
}

const togglePopup = (elem, isVisible) => {
  const pageOverlayElement = document.querySelector('.PopupOverlay');

  elem.setAttribute('aria-hidden', !isVisible);
}

const addQuickProductToCart = (variantid, quantity) => {
  return new Promise((resolve, reject) => {
    let formData = {
      'items': [{
       'id': variantid,
       'quantity': quantity
       }]
     };
     fetch(window.Shopify.routes.root + 'cart/add.js', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(formData)
     })
     .then(response => {
        resolve(response.json());        
     })
     .catch((error) => {
       console.error('Error:', error);
       reject();
     });
  });
}
const initProductCards = () => {
  console.log('init product cards');
  const desktopContentElements = document.querySelectorAll('.desktop-content');
  const mobileContentElements = document.querySelectorAll('.mobile-content');

  if (window.innerWidth <= 767) {
    desktopContentElements.forEach(function(element) {
      element.style.display = 'none';
    });
    mobileContentElements.forEach(function(element) {
      element.style.display = 'block';
    });
  } else {
    desktopContentElements.forEach(function(element) {
      element.style.display = 'block';
    });
    mobileContentElements.forEach(function(element) {
      element.style.display = 'none';
    });
  }
}
const initLookBooks = () => {
  console.log('initialize lookbooks');
  const swiperContainer = document.querySelector('.swiper-container-lookbook');
  
  if (swiperContainer) {
    const swiper = new Swiper(swiperContainer, {
      loop: true,
      slidesPerView: 2,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
          320: {
              slidesPerView: 2,
              spaceBetween: 10
          },
          768: {
              slidesPerView: 2,
              spaceBetween: 10
          }        
      },
      on: {
          init: function () {
              swiperContainer.style.visibility = 'visible';
              swiperContainer.style.opacity = '1';
          }
      }
    });
  }
}

const reinitCollectionProductSlider = () => {
  console.log('[CollectionSlider] Reload slider elements');
  document.querySelectorAll('.collection_product_slider').forEach(function(obj) {
    const activeIndex = obj.flickity('selectedIndex');
    const elem = obj.flickity('selectedElement');
    const type = elem.getAttribute('data-media-type');
    console.log(`[CollectionSlider] Slider Type: ${type}`);
    if (type === 'video') {
      elem.querySelector('video').play();
    }
  });

  document.querySelectorAll('.collection_product_slider').forEach(function(slider) {
    slider.addEventListener('select.flickity', (event) => {
      const activeIndex = slider.flickity('selectedIndex');
      console.log(`[CollectionSlider] Slide changed to ${activeIndex}`);
      const elem = slider.flickity('selectedElement');
      const type = elem.getAttribute('data-media-type');
      console.log(`Slider Type: ${type}`);
      if (type === 'video') {
        elem.querySelector('video').play();
      } else {
        slider.querySelector('video').pause();
      }
    });
  });
}

window.addEventListener('resize', () => {
  // const collectionProHeight = document.querySelector(".ProductItem__ImageWrapper").offsetHeight;
  // console.log("height---", collectionProHeight);

  // const collectionProHeightMobile = document.querySelector(".flickity-viewport").offsetHeight;
  // console.log("mobile height---", collectionProHeightMobile);

  // const bannerWrap = document.querySelector(".large_banner_collection_wrap .AspectRatio");

  // if (collectionProHeight === 0 && collectionProHeightMobile > 0) {
  //   bannerWrap.style.height = collectionProHeightMobile + 'px';
  // } else if (collectionProHeight > 0 && collectionProHeightMobile === 0) {
  //   bannerWrap.style.height = collectionProHeight + 'px';
  // }

  initLookBooks();  
  initProductCards();
});

document.querySelectorAll(".CollectionToolbar__LayoutType").forEach(function(toolbarItem) {
  toolbarItem.addEventListener('click', function() {
    setTimeout(function() {
      const collectionProHeight = document.querySelector(".ProductItem__ImageWrapper").offsetHeight;
      console.log("height---", collectionProHeight);

      const collectionProHeightMobile = document.querySelector(".flickity-viewport").offsetHeight;
      console.log("mobile height---", collectionProHeightMobile);

      const bannerWrap = document.querySelector(".large_banner_collection_wrap .AspectRatio");

      if (collectionProHeight === 0 && collectionProHeightMobile > 0) {
        bannerWrap.style.height = collectionProHeightMobile + 'px';
      } else if (collectionProHeight > 0 && collectionProHeightMobile === 0) {
        bannerWrap.style.height = collectionProHeight + 'px';
      }

      initLookBooks();      
    }, 500);
  });
});
