import * as components from "./captchaComponents"
export * from "./captchaComponents"

/**
 * @description "获取数学验证码"
 * @param req
 */
export function mathCaptcha(req: components.CaptchaReq) {
	return webapi.post<components.BaseResp>("/v1/api/captcha/math", req)
}

/**
 * @description "验证码图片"
 */
export function showCaptcha() {
	return webapi.get<null>("/v1/api/captcha/show")
}

/**
 * @description "验证码校验"
 * @param req
 */
export function processCaptcha(req: components.ProcessCaptchaReq) {
	return webapi.post<components.BaseResp>("/v1/api/captcha/process", req)
}

/**
 * @description "向邮箱发送验证码"
 * @param req
 */
export function emailCaptcha(req: components.EmailCaptchaReq) {
	return webapi.post<components.BaseResp>("/v1/api/captcha/email", req)
}

/**
 * @description "邮箱验证码校验"
 * @param req
 */
export function emailCaptchaVerify(req: components.EmailCaptchaVerifyReq) {
	return webapi.post<components.EmailCaptchaResp>("/v1/api/captcha/email/process", req)
}
