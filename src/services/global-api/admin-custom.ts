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
 * @description "获取活动列表"
 * @param req
 */
export function activityList(req: components.ListReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/activity/list", req, options)
}

/**
 * @description "获取活动信息"
 * @param req
 */
export function activityInfo(req: components.ActivityGetReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/activity", req, options)
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
 * @description "获取管理员列表"
 * @param req
 */
export function adminerList(req: components.ListReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/adminer/list", req, options)
}

/**
 * @description "获取管理员信息"
 * @param req
 */
export function adminerInfo(req: components.AdminerGetReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/adminer", req, options)
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
 * @description "获取抽奖者列表"
 * @param req
 */
export function luckerList(req: components.ListReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/lucker/list", req, options)
}

/**
 * @description "获取抽奖者信息"
 * @param req
 */
export function luckerInfo(req: components.LuckerGetReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/lucker", req, options)
}

/**
 * @description "添加抽奖者"
 * @param req
 */
export function luckerAdd(req: components.LuckerAddReq, options?: { [key: string]: any }) {
	return webapi.post<components.BaseResp>("/v1/api/admin/lucker", req, options)
}

/**
 * @description "编辑抽奖者"
 * @param req
 */
export function luckerPut(req: components.LuckerPutReq, options?: { [key: string]: any }) {
	return webapi.put<components.BaseResp>("/v1/api/admin/lucker", req, options)
}

/**
 * @description "删除抽奖者"
 * @param req
 */
export function luckerDel(req: components.LuckerDelReq, options?: { [key: string]: any }) {
	return webapi.delete<components.BaseResp>("/v1/api/admin/lucker", req, options)
}

/**
 * @description "获取奖品列表"
 * @param req
 */
export function prizeList(req: components.ListReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/prize/list", req, options)
}

/**
 * @description "获取奖品信息"
 * @param req
 */
export function prizeInfo(req: components.PrizeGetReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/prize", req, options)
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
 * @description "获取奖品池列表"
 * @param req
 */
export function PrizesPoolList(req: components.ListReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/PrizesPool/list", req, options)
}

/**
 * @description "获取奖品池信息"
 * @param req
 */
export function PrizesPoolInfo(req: components.PrizesPoolGetReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/PrizesPool", req, options)
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
 * @description "获取项目列表"
 * @param req
 */
export function projectList(req: components.ListReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/project/list", req, options)
}

/**
 * @description "获取项目信息"
 * @param req
 */
export function projectInfo(req: components.ProjectGetReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/project", req, options)
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
 * @param req
 */
export function userList(req: components.ListReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/user/list", req, options)
}

/**
 * @description "获取用户信息"
 * @param req
 */
export function userInfo(req: components.UserGetReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/user", req, options)
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
 * @description "获取用户池列表"
 * @param req
 */
export function usersPoolList(req: components.ListReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/usersPool/list", req, options)
}

/**
 * @description "获取用户池信息"
 * @param req
 */
export function usersPoolInfo(req: components.UsersPoolGetReq, options?: { [key: string]: any }) {
	return webapi.get<components.BaseResp>("/v1/api/admin/usersPool", req, options)
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
