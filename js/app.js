import { valida } from './validacao.js';

const inputs = document.querySelectorAll('input')/* Para pegar todos os inputs, utilizando o selector de tag */

inputs.forEach(input => {/* Para cada input que temos vamos chamar a função valida, passando o evento.target */

    if(input.dataset.tipo === 'preco') {
        SimpleMaskMoney.setMask(input, {
           
            prefix: 'R$ ',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
            })
    }

    input.addEventListener('blur', (evento) => {
        valida(evento.target)
    })
})

/* Dependendo do tipo de input, ele vai chamar a função adequada */