/* eslint-env worker */

const {get_representation} = require('./glossary')

function show_term_tooltip(term, type='', level='') {

  clearTimer(window.globals.tooltipped2)
  clearTimer(window.globals.tooltipped)
  window.globals.show_tooltip = addTimer(function(){
    if ($('#reference-window-back0').hasClass('tablinks_hoverd'+level)) {
      requestAnimationFrame(function(){$('.tooltip_image_innovation'+level).stop().fadeTo(((level=='')?100:50), 1)})//show("slide", { direction: "right" }, 200);
    }
  }, (level=='')?200:50)
  $('#reference-window-back0').addClass('tablinks_hoverd'+level)

  let repr = get_representation(term).clone()

  requestAnimationFrame(function(){
    $('.tooltip_image_innovation_wrapper'+level).css('min-height', $('.tooltip_image_innovation_wrapper'+level).css('height'))

    if (type != '') {
      let found_accordion = false
      let found_content = false
      for (let i=0; i<repr.length; i++) {
        if (found_accordion && found_content) {
          break
        }
        if (repr[i].classList.contains('accordion')) {
          // console.log('Found 0 acc')
          if (repr[i].getAttribute('id') == type) {
            // console.log('Found 1 acc')
            found_accordion = true
            if ((i > 0) && (repr[i-1].nodeName == 'IMG')) {
              $('.tooltip_image_innovation_wrapper'+level).html(repr[i-1])//.cloneNode(true)
              $('.tooltip_image_innovation_wrapper'+level).append(repr[i])
            } else {
              $('.tooltip_image_innovation_wrapper'+level).html(repr[i])
            }

          }
        } else if (repr[i].classList.contains('content')) {
          // console.log('Found 0 cont')
          if (repr[i].getAttribute('id') == type) {
            // console.log('Found 1 cont')
            found_content = true
            if (type.includes('spells')) {
              let elem = $('.reference-data.'+adapt_name(term)).find('.content#'+type)
              if (elem.length > 0) {
                $('.tooltip_image_innovation_wrapper'+level).append(elem.clone())
              } else if (level != '') {
                $('.tooltip_image_innovation_wrapper'+level).append(repr[i].querySelector('.content#'+type).cloneNode(true))
              }

            } else {
              $('.tooltip_image_innovation_wrapper'+level).append(repr[i])
            }
          } else {
            if (repr[i].querySelector('.accordion#'+type) != null) {
              found_accordion = true
              found_content = true
              let clone1 = $('.reference-data.'+adapt_name(term)).find('.accordion#'+type)
              let clone2 = $('.reference-data.'+adapt_name(term)).find('.content#'+type)
              if (clone1.length > 0) {
                $('.tooltip_image_innovation_wrapper'+level).html(clone1.clone())
                $('.tooltip_image_innovation_wrapper'+level).append(clone2.clone())
              } else {
                $('.tooltip_image_innovation_wrapper'+level).html(repr[i].querySelector('.accordion#'+type).cloneNode(true))
                $('.tooltip_image_innovation_wrapper'+level).append(repr[i].querySelector('.content#'+type).cloneNode(true))
              }

            }
          }
        }
      }
      $('.tooltip_image_innovation_wrapper'+level).children('.accordion').removeClass('actived')
      $('.tooltip_image_innovation_wrapper'+level).children('.content').slideDown(0)

    } else {
      $('.tooltip_image_innovation_wrapper'+level).html(repr)
      if (level == '') {
        $('.tooltip_image_innovation_wrapper').children('.accordion').each(function() {
          $(this).removeClass('actived')
        })
        clearTimer(window.globals.slide_down)
        window.globals.slide_down = addTimer(function() {
          requestAnimationFrame(function(){
            $('.tooltip_image_innovation_wrapper').children('.content').each(function() {
              $(this).slideDown(0)
            })
          })
        }, 500)
      }
    }

    $('.tooltip_image_innovation_wrapper'+level).children('.accordion').addClass('in_tooltip')
    let close_image = $('.tooltip_image_innovation_wrapper'+level).find('.close_image')

    let current = selectize.getValue()

    if (close_image.length > 0 && current.includes(term)) {
      close_image.addClass('in_tooltip')
      close_image.attr('src', pathToAssetL('images/icons/star.png'))
      close_image.css({
        'width': ((type == 'main')||(type == ''))? '2.8em': '1.3em !important',
        'height': ((type == 'main')||(type == ''))? '2.8em': '1.3em !important',
        'transition': 'width 0s',
        'opacity': 0.5,
        'float': 'right'
        // 'padding-top': (type == 'main')? '0.5%': '0.2%',
      })
    } else {
      close_image.hide()
    }

    $('.tooltip_image_innovation_wrapper'+level).children('.accordion#main').addClass('main'+level)

    let values = selectize.getValue()
    for (let i=0; i<values.length; i++) {
      mark_links(values[i], '.link_button', 'add')
    }
    $('.tooltip_image_innovation_wrapper'+level).css('min-height', repr.css('height'))
    if (level == '') {
      $('.tooltip_image_innovation').scrollTop(0)
    }
  })
}
