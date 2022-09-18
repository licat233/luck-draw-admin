import { FC, useRef, useState } from 'react';
import { ModalForm, ProFormDigit, ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { activityEnumList, projectEnumList, UsersPool } from '@/services/global-api/admin-custom';
import styles from '../style.less';
import { message } from 'antd';
import { ActivityDetailInfo } from '../data';
import { DefaultOptionType } from 'antd/lib/select';

type UsersPoolModalProps = {
    done: boolean;
    visible: boolean;
    current: Partial<ActivityDetailInfo> | undefined;
    onDone: () => void;
    onSubmit: (values: UsersPool) => Promise<boolean>;
}

const UsersPoolModal: FC<UsersPoolModalProps> = (props) => {
    const { done, visible, current, onDone, onSubmit, children } = props;
    const formRef = useRef<ProFormInstance>();
    const user = current?.user;
    const usersPool = current?.usersPool;
    const activity = current?.activity;

    // const [projectId, setProjectId] = useState<number | undefined>(activity?.project_id)
    const [activityOptions, setActivityOptions] = useState<DefaultOptionType[]>([])
    const activityOptionsMark = useRef(0);  //http请求标记，防止异步冲突

    const activityEnumCache = useRef<Map<number, DefaultOptionType[]>>(new Map())
    const RequestActivityOptionsList = async (project_id: number | undefined): Promise<DefaultOptionType[]> => {
        if (typeof project_id === 'undefined' || project_id === undefined) return [];
        if (activityEnumCache.current.has(project_id)) return activityEnumCache.current.get(project_id) || [];
        try {
            const res = await activityEnumList({ project_id })
            activityEnumCache.current.set(project_id, res)
            return res
        } catch (error: any) {
            message.error(error.message)
        }
        return []
    }

    const onDoneHandler = () => {
        onDone()
        setActivityOptions([])
    }

    return (
        <ModalForm<UsersPool>
            visible={visible}
            title={done ? null : `用户${current?.user?.name}-参与活动${usersPool ? '编辑' : '添加'}`}
            className={styles.standardListForm}
            width={375}
            onFinish={async (values) => {
                if (!user?.id) {
                    message.error("获取不到当前用户id")
                    return
                }
                const ok = await onSubmit({ ...usersPool, ...values, user_id: user?.id });
                ok && onDoneHandler();
            }}
            initialValues={{ status: 1, score: 0, ...usersPool }}
            submitter={{
                render: (_, dom) => (done ? null : dom),
            }}
            trigger={<>{children}</>}
            modalProps={{
                onCancel: onDoneHandler,
                destroyOnClose: true,
                bodyStyle: done ? { padding: '72px 0' } : {},
            }}
            formRef={formRef}
        >

            <ProFormSelect
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                ]}
                width="md"
                name="project_id"
                label='项目'
                initialValue={activity?.project_id}
                request={projectEnumList}
                fieldProps={{
                    onChange: async (val: number) => {
                        const markTimestamp = new Date().valueOf()
                        activityOptionsMark.current = markTimestamp
                        const markNumber = markTimestamp
                        const res = await RequestActivityOptionsList(val)
                        if (markNumber === activityOptionsMark.current) { //表示是最新请求
                            setActivityOptions(res) //更新活动选项
                            formRef.current?.setFieldValue("activity_id", undefined)
                        }
                    },
                }}
            />
            <ProFormSelect
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                ]}
                placeholder="请选择活动"
                options={activityOptions}
                width="md"
                name="activity_id"
                label='活动'
            />
            <ProFormDigit
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                ]}
                width="md"
                name="score"
                label='积分'
            />
            <ProFormSelect
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                ]}
                options={[{ label: "允许", value: 1 }, { label: "禁止", value: 0 }]}
                width="md"
                name="status"
                label='状态'
            />
        </ModalForm>
    );
}

export default UsersPoolModal;