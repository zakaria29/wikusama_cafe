const modelUser = require(`../models`).user
const joi = require(`joi`)
const md5 = require(`md5`)
const jwt = require(`jsonwebtoken`)
const SECRET_KEY = `thisIsSecretKey`
const jwtHeader = {
    algorithm: "HS256"
}
const encryptToken = async (payload) => {
    let token = jwt.sign(payload, SECRET_KEY, jwtHeader)
    return token
}

const verifyToken = async (token) => {
    try {
        let decode = jwt.verify(token, SECRET_KEY)
        return true
    } catch (error) {
        return false;
    }
    
}

const decryptToken = async (token) => {
    return jwt.decode(token)
}


const validateAuth = async (input) => {
    /** define rules of validation */
    let rules = joi.object().keys({
        username: joi.string().required(),
        password: joi.string().required()
    })

    /** validation proses */
    let { error } = rules.validate(input)

    if (error) {
        /** arrange a error message of validation */
        let message = error
            .details
            .map(item => item.message)
            .join(`,`)
        return {
            status: false,
            message: message
        }
    }
    return { status: true }
}
exports.authentication = async (request, response) => {
    try {
        /** validate data */
        let resultValidation = validateAuth(request.body)
        if (resultValidation.status == false) {
            return response
                .status(400)
                .json({
                    status: false,
                    message: resultValidation.message
                })
        }

        /** get user based on username and password */
        let params = {
            username: request.body.username,
            password: md5(request.body.password)
        }
        let result = await modelUser.findOne({ where: params })
        if (result) {
            let token = await encryptToken(JSON.stringify(result))
            return response
                .json({
                    status: true,
                    data: result,
                    token: token
                })
        } else {
            return response
                .json({
                    status: false,
                    message: `Invalid username or password`
                })
        }

    } catch (error) {
        return response
            .status(400)
            .json({
                status: false,
                message: error.message
            })
    }
}

exports.authorization = (roles) => {
    return async function(request, response, next) {
        try {
            /** grab header */
            let headerAuth = request.headers.authorization
            /** get token using split from Bearer  */
            let token = headerAuth?.split(" ")[1]

            if (token == null) {
                return response
                    .status(401)
                    .json({ message: `Unauthorization` })
            }

            if (! await verifyToken(token)) {
                return response
                    .status(401)
                    .json({ message: `Invalid Token` })
            }

            let paylodToken = await decryptToken(token)
            if(!roles.includes(paylodToken?.role)){
                return response
                    .status(403)
                    .json({ message: `Forbidden Access` })
            }
            next()
        } catch (error) {
            return response
                .status(400)
                .json({
                    status: false,
                    message: error.message
                })
        }
    }
    
}