import { webapi } from "./webapi"
import * as components from "./captchaComponents"
export * from "./captchaComponents"

/**
 * @description "获取数学验证码"
 * @param req
 */
export function mathCaptcha(req: components.CaptchaReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/captcha/math", req, options)
}

/**
 * @description "验证码图片"
 */
export function showCaptcha(options?: { [key: string]: any }) {
	return webapi.get<null>("/v1/api/captcha/show", options)
}

/**
 * @description "验证码校验"
 * @param req
 */
export function processCaptcha(req: components.ProcessCaptchaReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/captcha/process", req, options)
}

/**
 * @description "向邮箱发送验证码"
 * @param req
 */
export function emailCaptcha(req: components.EmailCaptchaReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/captcha/email", req, options)
}

/**
 * @description "邮箱验证码校验"
 * @param req
 */
export function emailCaptchaVerify(req: components.EmailCaptchaVerifyReq, options?: { [key: string]: any }) {
	return webapi.post<components.EmailCaptchaResp>("/v1/api/captcha/email/process", req, options)
}
