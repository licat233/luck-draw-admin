import { webapi } from "./webapi"
import * as components from "./adminComponents"
export * from "./adminComponents"

/**
 * @description "登录"
 * @param req
 */
export function login(req: components.LoginReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/login", req, options)
}

/**
 * @description "邮箱登录"
 * @param req
 */
export function loginByEmail(req: components.LoginByEmailReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/loginByEmail", req, options)
}

/**
 * @description "给登录邮箱发送验证码"
 * @param req
 */
export function loginEmailCaptcha(req: components.LoginEmailCaptchaReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/loginEmailCaptcha", req, options)
}

/**
 * @description "给注册邮箱发送验证码"
 * @param req
 */
export function registerEmailCaptcha(req: components.RegisterEmailCaptchaReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/registerEmailCaptcha", req, options)
}

/**
 * @description "给绑定邮箱发送验证码"
 * @param req
 */
export function bindEmailCaptcha(req: components.BindEmailCaptchaReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/bindEmailCaptcha", req, options)
}

/**
 * @description "注销"
 */
export function logout(options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/logout", options)
}

/**
 * @description "获取当前用户信息"
 */
export function currentUser(options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/currentUser", options)
}

/**
 * @description "上传头像"
 */
export function uploadAvatar(options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/uploadAvatar", options)
}

/**
 * @description "上传logo"
 */
export function uploadLogo(options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/uploadLogo", options)
}

/**
 * @description "上传图片"
 */
export function uploadImg(options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/uploadImg", options)
}

/**
 * @description "获取活动列表，因为设计数组传参，post方式会比较合适"
 * @param req
 */
export function activityList(req: components.ActivityListReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/activity/list", req, options)
}

/**
 * @description "获取活动信息"
 * @param params
 */
export function activityInfo(params: components.ActivityGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/activity", params, options)
}

/**
 * @description "添加活动"
 * @param req
 */
export function activityAdd(req: components.ActivityAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/activity", req, options)
}

/**
 * @description "编辑活动"
 * @param req
 */
export function activityPut(req: components.ActivityPutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/activity", req, options)
}

/**
 * @description "删除活动"
 * @param req
 */
export function activityDel(req: components.ActivityDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/activity", req, options)
}

/**
 * @description "枚举列表"
 */
export function activityEnumList(options?: { [key: string]: any }) {
	return webapi.get<Array<components.Enum>>("/v1/api/admin/activity/enumList", options)
}

/**
 * @description "指定项目的活动"
 * @param params
 */
export function projectActivity(params: components.ProjectActivityReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/activity/projectActivity", params, options)
}

/**
 * @description "获取管理员列表"
 * @param params
 */
export function adminerList(params: components.AdminerListReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/adminer/list", params, options)
}

/**
 * @description "获取管理员信息"
 * @param params
 */
export function adminerInfo(params: components.AdminerGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/adminer", params, options)
}

/**
 * @description "添加管理员"
 * @param req
 */
export function adminerAdd(req: components.AdminerAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/adminer", req, options)
}

/**
 * @description "编辑管理员"
 * @param req
 */
export function adminerPut(req: components.AdminerPutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/adminer", req, options)
}

/**
 * @description "删除管理员"
 * @param req
 */
export function adminerDel(req: components.AdminerDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/adminer", req, options)
}

/**
 * @description "管理员修改自己的账号信息"
 * @param req
 */
export function modify(req: components.AdminerModifyReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/adminer/modify", req, options)
}

/**
 * @description "枚举列表"
 */
export function adminerEnumList(options?: { [key: string]: any }) {
	return webapi.get<Array<components.Enum>>("/v1/api/admin/adminer/enumList", options)
}

/**
 * @description "获取抽奖单列表"
 * @param params
 */
export function luckerList(params: components.LuckerListReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/lucker/list", params, options)
}

/**
 * @description "获取抽奖单详细列表"
 * @param req
 */
export function luckerDetails(req: components.LuckerDetailsReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/lucker/details", req, options)
}

/**
 * @description "获取抽奖单信息"
 * @param params
 */
export function luckerInfo(params: components.LuckerGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/lucker", params, options)
}

/**
 * @description "添加抽奖单"
 * @param req
 */
export function luckerAdd(req: components.LuckerAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/lucker", req, options)
}

/**
 * @description "编辑抽奖单"
 * @param req
 */
export function luckerPut(req: components.LuckerPutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/lucker", req, options)
}

/**
 * @description "编辑抽奖单by prize"
 * @param req
 */
export function putByPrize(req: components.LuckerPutByPrizeReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/lucker/putByPrize", req, options)
}

/**
 * @description "删除抽奖单"
 * @param req
 */
export function luckerDel(req: components.LuckerDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/lucker", req, options)
}

/**
 * @description "枚举列表"
 */
export function luckerEnumList(options?: { [key: string]: any }) {
	return webapi.get<Array<components.Enum>>("/v1/api/admin/lucker/enumList", options)
}

/**
 * @description "获取奖品列表"
 * @param params
 */
export function prizeList(params: components.PrizeListReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/prize/list", params, options)
}

/**
 * @description "获取奖品信息"
 * @param params
 */
export function prizeInfo(params: components.PrizeGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/prize", params, options)
}

/**
 * @description "添加奖品"
 * @param req
 */
export function prizeAdd(req: components.PrizeAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/prize", req, options)
}

/**
 * @description "编辑奖品"
 * @param req
 */
export function prizePut(req: components.PrizePutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/prize", req, options)
}

/**
 * @description "删除奖品"
 * @param req
 */
export function prizeDel(req: components.PrizeDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/prize", req, options)
}

/**
 * @description "枚举列表"
 */
export function prizeEnumList(options?: { [key: string]: any }) {
	return webapi.get<Array<components.Enum>>("/v1/api/admin/prize/enumList", options)
}

/**
 * @description "获取某活动奖品池的奖品"
 * @param params
 */
export function activityPrizes(params: components.ActivityPrizesReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/prize/activityPrizes", params, options)
}

/**
 * @description "获取奖品级别列表"
 * @param params
 */
export function prizeGradeList(params: components.ListReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/prizeGrade/list", params, options)
}

/**
 * @description "获取奖品级别信息"
 * @param params
 */
export function prizeGradeInfo(params: components.PrizeGradeGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/prizeGrade", params, options)
}

/**
 * @description "添加奖品级别"
 * @param req
 */
export function prizeGradeAdd(req: components.PrizeGradeAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/prizeGrade", req, options)
}

/**
 * @description "编辑奖品级别"
 * @param req
 */
export function prizeGradePut(req: components.PrizeGradePutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/prizeGrade", req, options)
}

/**
 * @description "删除奖品级别"
 * @param req
 */
export function prizeGradeDel(req: components.PrizeGradeDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/prizeGrade", req, options)
}

/**
 * @description "枚举列表"
 */
export function prizeGradeEnumList(options?: { [key: string]: any }) {
	return webapi.get<Array<components.Enum>>("/v1/api/admin/prizeGrade/enumList", options)
}

/**
 * @description "获取奖品池列表"
 * @param params
 */
export function PrizesPoolList(params: components.ListReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/PrizesPool/list", params, options)
}

/**
 * @description "获取奖品池信息"
 * @param params
 */
export function PrizesPoolInfo(params: components.PrizesPoolGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/PrizesPool", params, options)
}

/**
 * @description "添加奖品池"
 * @param req
 */
export function PrizesPoolAdd(req: components.PrizesPoolAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/PrizesPool", req, options)
}

/**
 * @description "编辑奖品池"
 * @param req
 */
export function PrizesPoolPut(req: components.PrizesPoolPutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/PrizesPool", req, options)
}

/**
 * @description "删除奖品池"
 * @param req
 */
export function PrizesPoolDel(req: components.PrizesPoolDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/PrizesPool", req, options)
}

/**
 * @description "获取某活动的奖品池"
 * @param params
 */
export function searchPrizesPool(params: components.SearchPrizesPoolParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/PrizesPool/search", params, options)
}

/**
 * @description "获取项目列表"
 * @param params
 */
export function projectList(params: components.ProjectListReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/project/list", params, options)
}

/**
 * @description "获取项目信息"
 * @param params
 */
export function projectInfo(params: components.ProjectGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/project", params, options)
}

/**
 * @description "添加项目"
 * @param req
 */
export function projectAdd(req: components.ProjectAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/project", req, options)
}

/**
 * @description "编辑项目"
 * @param req
 */
export function projectPut(req: components.ProjectPutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/project", req, options)
}

/**
 * @description "删除项目"
 * @param req
 */
export function projectDel(req: components.ProjectDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/project", req, options)
}

/**
 * @description "枚举列表"
 */
export function projectEnumList(options?: { [key: string]: any }) {
	return webapi.get<Array<components.Enum>>("/v1/api/admin/project/enumList", options)
}

/**
 * @description "获取授权策略"
 * @param req
 */
export function getPolicy(req: components.PolicyReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/rbac/policy", req, options)
}

/**
 * @description "添加授权策略"
 * @param req
 */
export function addPolicy(req: components.PolicyReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/rbac/policy", req, options)
}

/**
 * @description "修改授权规则"
 * @param req
 */
export function putPolicy(req: components.PolicyReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/rbac/policy", req, options)
}

/**
 * @description "删除授权规则"
 * @param req
 */
export function delPolicy(req: components.PolicyReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/rbac/policy", req, options)
}

/**
 * @description "批量获取授权策略"
 * @param req
 */
export function getPolicies(req: components.PoliciesReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/rbac/policies", req, options)
}

/**
 * @description "批量添加授权策略"
 * @param req
 */
export function addPolicies(req: components.PoliciesReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/rbac/policies", req, options)
}

/**
 * @description "批量修改授权规则"
 * @param req
 */
export function putPolicies(req: components.PoliciesReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/rbac/policies", req, options)
}

/**
 * @description "批量删除授权规则"
 * @param req
 */
export function delPolicies(req: components.PoliciesReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/rbac/policies", req, options)
}

/**
 * @description "获取当前策略中显示的操作列表"
 */
export function getAllActions(options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/rbac/all-actions", options)
}

/**
 * @description "获取策略中的所有授权规则"
 */
export function getAllPolicy(options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/rbac/all-policies", options)
}

/**
 * @description "获取当前策略中显示的 object 列表"
 */
export function getAllObjects(options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/rbac/all-objects", options)
}

/**
 * @description "将获得所有与该域相关联的用户"
 * @param req
 */
export function getAllUsersByDomain(req: components.DomainReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/rbac/domain-users", req, options)
}

/**
 * @description "获取用户在某域内的权限"
 * @param req
 */
export function getPermissionsForUserInDomain(req: components.RoleAndDomainReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/rbac/permissions", req, options)
}

/**
 * @description "获取用户列表"
 * @param params
 */
export function userList(params: components.UserListReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/user/list", params, options)
}

/**
 * @description "获取用户信息"
 * @param params
 */
export function userInfo(params: components.UserGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/user", params, options)
}

/**
 * @description "添加用户"
 * @param req
 */
export function userAdd(req: components.UserAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/user", req, options)
}

/**
 * @description "编辑用户"
 * @param req
 */
export function userPut(req: components.UserPutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/user", req, options)
}

/**
 * @description "删除用户"
 * @param req
 */
export function userDel(req: components.UserDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/user", req, options)
}

/**
 * @description "枚举列表"
 */
export function userEnumList(options?: { [key: string]: any }) {
	return webapi.get<Array<components.Enum>>("/v1/api/admin/user/enumList", options)
}

/**
 * @description "获取用户池列表"
 * @param params
 */
export function usersPoolList(params: components.ListReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/usersPool/list", params, options)
}

/**
 * @description "获取用户池信息"
 * @param params
 */
export function usersPoolInfo(params: components.UsersPoolGetReqParams, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/usersPool", params, options)
}

/**
 * @description "添加用户池"
 * @param req
 */
export function usersPoolAdd(req: components.UsersPoolAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/usersPool", req, options)
}

/**
 * @description "编辑用户池"
 * @param req
 */
export function usersPoolPut(req: components.UsersPoolPutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/usersPool", req, options)
}

/**
 * @description "删除用户池"
 * @param req
 */
export function usersPoolDel(req: components.UsersPoolDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/usersPool", req, options)
}
