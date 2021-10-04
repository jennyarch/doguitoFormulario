export function valida (input) {
    const tipoDeInput = input.dataset.tipo /* Pra poder acessar os data-atributes de um input */

    if(validadores [tipoDeInput]) {/* Para saber se a função está dentro de validadores criando uma condição, essa condição questiona se existe dentro da varariavel validadores o tipoDeInput */
        validadores[tipoDeInput](input)
    }

    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro      (tipoDeInput, input)
    }
}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {/* Aqui foi criado uma objeo para guardar as mensagens de erro */
    nome: {
        valueMissing: 'O campo nome não pode estar vazio.'
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é valido.'
    },
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve pelo menos ter uma letra maiúscula, um numero e não deve conter símbolos'
    },
    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior de 18 anos para se castrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado não é valido.'
    },
    cep: {
        valueMissing: 'O campo de CEP nao pode estar vazio.',
        patternMismatch: 'O CEP digitado nao é valido.',
        customError: 'Nao foi possivel buscar o CEP.'
    },
    logradouro: {
        valueMissing: 'O campo de logradouro nao pode estar vazio',     
    },
    cidade: {
        valueMissing: 'O campo de cidade nao pode estar vazio',     
    },
    estado: {
        valueMissing: 'O campo de estado nao pode estar vazio'  
    },
    preco: {
        valueMissing: 'O campo de preco náo pode estar vazio'
    }

}    

const validadores = {/* Será um objeto */
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
}

function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''
    tiposDeErro.forEach(erro => {
        if(input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}

function validaDataNascimento (input) {
    const dataRecebida = new Date(input.value)
    let mensagem = ''

    if (!maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar.'
    }

    input.setCustomValidity(mensagem)
}



function maiorQue18(data) {
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    return dataMais18 <= dataAtual
}

function validaCPF (input) {
    const cpfFormatado = input.value.replace(/\D/g, '')/*Tdo que não for digito, será substituido por uma string vazia */
    let mensagem = ''

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é valido.'
    }

    input.setCustomValidity(mensagem)
}

function checaCPFRepetido (cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    let cpfValido = true

    valoresRepetidos.forEach(valor => {
        if (valor ==  cpf) {
            cpfValido = false
        }
    })

    return cpfValido
}


function checaEstruturaCPF (cpf) {
    const multiplicador = 10


    return checaDigitoVerificador (cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador) {
    if (multiplicador >= 12) {
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--){
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++
    }

    if (digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito (soma) {
    return 11 - (soma % 11)
}

function recuperarCEP (input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
               if(data.erro) {
                   input.setCustomValidity('Nao foi possivel buscar o CEP.')
                return    
                }
                input.setCustomValidity('')
                preencheCamposComCEP(data)
                return
            }
            
        )
        
    }
}

function preencheCamposComCEP (data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}


/* 123 456 789 09
let soma = (11 * 1) + (10 * 2) + (9 * 3) ... (2 * 0)
let digitoVerificador = 11 - (soma % 11) */
/* 
    No JavaScript, também é possível tratar erros de validação utilizando a propriedade validity do input, como utilizamos na validação customizada do campo “data do nascimento”.

    Vamos usar uma função do input setCustomValidity()` para definir uma mensagem de erro customizada.

*/
/* 
-----
Para a validação do campo de CPF, existe uma API do governo que faz as validações, garantindo que o CPF é válido e que pertence à alguem. O problema é que essa API não é pública e também pode revelar informações pessoais. Então não podemos fazer a validação de que o CPF pertence à alguém, mas podemos verificar a integridade da estrutura desse CPF através de uma fórmula matemática.
------
    function checaDigitoVerificadorCPF(cpf, multiplicador) {
    let soma = 0
    let contador = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(; multiplicador > 1 ; multiplicador--) {
        soma = soma + cpfSemDigitos[contador] * multiplicador
        contador++
    }

    if(soma % 11 > 9) {
        return digitoVerificador == 0
    }

    return digitoVerificador == 11 - (soma % 11)
}
*/


/* 
    method: 'GET' é o tipo de requisição que será feita.

    mode: 'cors' indica que a comunicação será feita entre aplicações diferentes.

    headers: {'content-type': 'application/json;charset=utf-8'} diz como que queremos receber as informações da API.

Essas são informações básicas para fazer uma requisição. Vale pensar da seguinte maneira: como queremos (method) e o que queremos (headers). A opção mode é opcional, mas ela é necessária quando vamos fazer chamadas entre aplicações diferentes.

*/