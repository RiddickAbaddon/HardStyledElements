class HardStyledElements {
   constructor(elements) {
      this.elements = new Array()

      elements.forEach(element => {
         let tmpElements = document.querySelectorAll(element)

         tmpElements.forEach(element2 => {
            this.elements.push(element2)
         })
      })

      this.bindElements = new Array()

      this.prepareElements()
   }

   prepareElements() {
      this.elements.forEach(element => {
         switch(element.nodeName) {
            case 'SELECT': {
               if(element.getAttribute('multiple') === null) {
                  this.prepareSelect(element)
               } else {
                  this.prepareMultiselect(element)
               }
               break
            }
            case 'INPUT': {

               switch(element.getAttribute('type').toLowerCase()) {
                  case 'checkbox': {
                     this.prepareCheckbox(element)
                     break;
                  }
                  case 'radio': {
                     this.prepareRadio(element)
                     break
                  }
                  case 'file': {
                     this.prepareFile(element)
                     break
                  }
               }
            }
         }
      })
   }

   // Select
   prepareSelect(element) {
      let container = document.createElement('div')
      container.classList.add('hse-select-container')
      container.setAttribute('tabindex', '0')
      element.classList.forEach(className => {
         container.classList.add(className)
      })

      element.removeAttribute('class')

      let select = document.createElement('div')
      select.classList.add('hse-select')

      let options = document.createElement('div')
      options.classList.add('hse-options')

      let selected = null

      element.childNodes.forEach(child => {
         if(child.nodeName === 'OPTION') {
            let value = child.value
            let text = child.innerText
            let option = document.createElement('div')
            option.setAttribute('value', value)
            option.innerText = text
            option.classList.add('hse-option')
            if(child.getAttribute('selected') !== null) {
               option.classList.add('hse-selected')
               option.setAttribute('selected', 'true')
               selected = {
                  value: value,
                  text: text
               }
            }
            options.appendChild(option)
         }
      })

      if(selected === null && options.childNodes.length > 0) {
         options.childNodes[0].classList.add('hse-selected')
         options.childNodes[0].setAttribute('selected', 'true')
         selected = {
            value: options.childNodes[0].getAttribute('value'),
            text: options.childNodes[0].innerText
         }
      }

      select.setAttribute('value', selected.value)
      select.innerText = selected.text

      container.appendChild(select)
      container.appendChild(options)

      container.addEventListener('click', event => this.selectClick(event, container))
      container.addEventListener('blur', this.selectBlur)

      this.bindElements.push({
         original: element,
         new: container
      })

      this.insertAfter(container, element)
      element.style.display = 'none'
   }

   selectClick(event, container) {
      if (this.hasClass(event.toElement, 'hse-option')) {
         this.selectChangeOption(container, event.toElement.getAttribute('value'))

      }
      if (this.hasClass(container, 'hse-expanded')) {
         container.classList.remove('hse-expanded')
      } else {
         container.classList.add('hse-expanded')
      }
   }

   selectBlur() {
      this.classList.remove('hse-expanded')
   }

   selectChangeOption(container, value) {
      let originalEl = this.getOriginal(container)
      let optionsList = container.childNodes[1].childNodes
      let selectedText = ''

      optionsList.forEach((option, index) => {
         if(option.getAttribute('selected') === 'true' && option.getAttribute('value') !== value) {
            option.removeAttribute('selected')
            option.classList.remove('hse-selected')
         }
         else if(option.getAttribute('value') === value) {
            option.setAttribute('selected', 'true')
            option.classList.add('hse-selected')
            selectedText = option.innerText
            originalEl.selectedIndex = index
         }
      })

      container.childNodes[0].setAttribute('value', value)
      container.childNodes[0].innerText = selectedText
   }

   // Checkbox
   prepareCheckbox(element) {
      let container = document.createElement('div')
      container.classList.add('hse-checkbox')
      element.classList.forEach(className => {
         container.classList.add(className)
      })

      element.removeAttribute('style')

      let mark = document.createElement('div')
      mark.classList.add('hse-checkbox-mark')
      if(element.getAttribute('checked') !== null) {
         container.classList.add('hse-checked')
         container.setAttribute('checked', 'true')
      }

      container.appendChild(mark)

      if(!this.hasParent(element, 'LABEL')) {
         container.addEventListener('click', () => this.checkboxClick(container, element))
      }
      element.addEventListener('click', () => this.checkboxClick(container, element))

      this.insertAfter(container, element)
      element.style.display = 'none'
   }

   checkboxClick(container, originalEl) {
      if(this.hasClass(container, 'hse-checked')) {
         container.classList.remove('hse-checked')
         container.removeAttribute('checked')
         originalEl.checked = false
      } else {
         container.classList.add('hse-checked')
         container.setAttribute('checked', 'true')
         originalEl.checked = true
      }
   }

   // Radio
   prepareRadio(element) {
      let container = document.createElement('div')
      container.classList.add('hse-radio')
      container.setAttribute('name', element.getAttribute('name'))
      container.setAttribute('value', element.getAttribute('value'))
      element.classList.forEach(className => {
         container.classList.add(className)
      })

      element.removeAttribute('style')

      let mark = document.createElement('div')
      mark.classList.add('hse-radio-mark')
      if(element.getAttribute('checked') !== null) {
         container.classList.add('hse-checked')
         container.setAttribute('checked', 'true')
      }

      container.appendChild(mark)


      if(!this.hasParent(element, 'LABEL')) {
         container.addEventListener('click', () => this.radioClick(container))
      }
      element.addEventListener('click', () => this.radioClick(container))

      this.bindElements.push({
         original: element,
         new: container
      })

      this.insertAfter(container, element)
      element.style.display = 'none'
   }

   radioClick(container) {
      if(!this.hasClass(container, 'hse-checked')) {
         let radioGroup = this.getRadioGroup(container)

         radioGroup.forEach(element => {
            if(element.original.getAttribute('value') === container.getAttribute('value')) {
               element.original.checked = true
               element.new.setAttribute('checked', 'true')
               element.new.classList.add('hse-checked')
            } else {
               element.original.checked = false
               element.new.removeAttribute('checked', 'true')
               element.new.classList.remove('hse-checked')
            }
         })
      }
   }

   getRadioGroup(container) {
      let name = container.getAttribute('name')
      let value = container.getAttribute('value')

      let radioGroup = new Array()
      this.bindElements.forEach(element => {
         if(
            element.original.nodeName === 'INPUT' &&
            element.original.getAttribute('type').toLowerCase() === 'radio' &&
            element.original.getAttribute('name') === name
         ) {
            radioGroup.push(element)
         }
      })

      return radioGroup
   }

   // File
   prepareFile(element) {
      let buttonText = element.dataset.button || 'Browse file'
      let nofileText = element.dataset.nofile || 'No file selected'

      let container = document.createElement('div')
      container.classList.add('hse-file-container')
      element.classList.forEach(className => {
         container.classList.add(className)
      })

      element.removeAttribute('style')

      let button = document.createElement('div')
      button.classList.add('hse-file-button')
      button.innerText = buttonText

      let text = document.createElement('div')
      text.classList.add('hse-file-text')
      text.innerText = nofileText

      container.appendChild(button)
      container.appendChild(text)

      if(element.value) {
         this.fileChange(element, container)
      }

      container.addEventListener('click', () => element.click())
      element.addEventListener('change', () => this.fileChange(element, container))

      this.insertAfter(container, element)
      element.style.display = 'none'
   }

   fileChange(element, container) {
      let fullPath = element.value
      let filename = ''

      if(fullPath !== '') {
         let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
         filename = fullPath.substring(startIndex);
         if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
         }
      } else {
         filename = element.dataset.nofile
      }

      container.childNodes[1].innerText = filename
   }

   // Multiselect
   prepareMultiselect(element) {
      let container = document.createElement('div')
      container.classList.add('hse-multiselect')
      element.classList.forEach(className => {
         container.classList.add(className)
      })

      element.removeAttribute('class')

      let listFramgent = document.createDocumentFragment()
      element.childNodes.forEach(child => {
         if(child.nodeName === 'OPTION') {
            let value = child.value
            let text = child.innerText
            let option = document.createElement('div')
            option.setAttribute('value', value)

            let mark = document.createElement('div')
            mark.classList.add('hse-multiselect-mark')
            option.appendChild(mark)

            let textEl = document.createTextNode(text)
            option.appendChild(textEl)

            option.classList.add('hse-option')
            if(child.getAttribute('selected') !== null) {
               option.classList.add('hse-selected')
               option.setAttribute('selected', 'true')
            }

            option.addEventListener('click', () => this.multiselectClick(option, child))
            listFramgent.appendChild(option)
         }
      })

      container.appendChild(listFramgent)

      this.insertAfter(container, element)
      element.style.display = 'none'
   }

   multiselectClick(option, child) {
      if(this.hasClass(option, 'hse-selected')) {
         option.classList.remove('hse-selected')
         option.removeAttribute('selected')
         child.selected = false
      } else {
         option.classList.add('hse-selected')
         option.setAttribute('selected', 'true')
         child.selected = true
      }
   }

   // Utils
   hasClass(element, className) {
      if ((' ' + element.className + ' ').replace(/[\n\t]/g, ' ').indexOf(` ${className} `) > -1) {
         return true
      } else {
         return false
      }
   }

   insertAfter(newNode, referenceNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
   }

   getOriginal(newEl) {
      return this.bindElements.find(element => element.new === newEl).original
   }

   hasParent(element, nodeName) {
      if(element.parentNode.nodeName === 'BODY') {
         return false
      }
      else if(element.parentNode.nodeName === nodeName) {
         return true
      }
      else {
         this.hasParent(element.parentNode, nodeName)
      }
   }
}

window.HardStyledElements = HardStyledElements