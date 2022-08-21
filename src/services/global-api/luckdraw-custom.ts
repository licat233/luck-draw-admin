import { webapi } from "./webapi"
import * as components from "./luckdrawComponents"
export * from "./luckdrawComponents"

/**
 * @description "展现抽奖页面"
 */
export function luckView(options?: { [key: string]: any }) {
	return webapi.get<null>("/v1/api/luckdraw/:shortlink", options)
}

/**
 * @description "抽奖者身份验证"
 * @param req
 */
export function identify(req: components.IdentifyReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/identify", req, options)
}

/**
 * @description "获取活动奖品列表"
 * @param req
 */
export function prizes(req: components.PrizesReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/prizes", req, options)
}

/**
 * @description "获取自己在某活动的中奖名单"
 * @param req
 */
export function luckerList(req: components.LuckerListReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/luckerList", req, options)
}

/**
 * @description "抽取奖品"
 * @param req
 */
export function goodluck(req: components.GoodluckReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/goodluck", req, options)
}

/**
 * @description "查询中奖信息"
 * @param req
 */
export function search(req: components.SearchReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/search", req, options)
}

/**
 * @description "挑选奖品"
 * @param req
 */
export function selectPrizes(req: components.SelectPrizesReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/selectPrizes", req, options)
}
