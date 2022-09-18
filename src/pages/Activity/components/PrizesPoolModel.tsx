import { FC, useRef, useState } from 'react';
import { ModalForm, ProFormDigit, ProFormInstance, ProFormSelect, ProFormItem } from '@ant-design/pro-form';
import { Prize, prizeInfo, PrizesPool } from '@/services/global-api/admin-custom';
import { prizeEnumList, prizeGradeEnumList } from '@/services/global-api/admin-custom';
import styles from '../style.less';
import { message } from 'antd';
import { PrizeDetailInfo } from '../data';

type PrizesPoolModalProps = {
    done: boolean;
    visible: boolean;
    current: Partial<PrizeDetailInfo> | undefined;
    onDone: () => void;
    onSubmit: (values: PrizesPool) => Promise<boolean>;
}

const PrizesPoolModal: FC<PrizesPoolModalProps> = (props) => {
    const { done, visible, current, onDone, onSubmit, children } = props;
    const formRef = useRef<ProFormInstance>();
    const record = current?.prizesPool;
    const activity = current?.activity;
    const [prizeImg, setPrizeImg] = useState<string>("");
    const httpCache = useRef<Record<number, Prize>>({})
    const onDoneHandler = () => {
        if (prizeImg !== "") setPrizeImg("");
        onDone()
    }
    return (
        <ModalForm<PrizesPool>
            onVisibleChange={(visible: boolean) => {
                if (visible) {
                    setPrizeImg(current?.image || "");
                } else {
                    setPrizeImg("");
                }
            }}
            visible={visible}
            title={done ? null : `${current?.activity?.name}活动-奖品${record ? '编辑' : '添加'}`}
            className={styles.standardListForm}
            width={375}
            onFinish={async (values) => {
                if (!activity?.id) {
                    message.error("获取不到当前活动id")
                    return
                }
                const ok = await onSubmit({ ...record, ...values, activity_id: activity?.id });
                ok && onDoneHandler();
            }}
            initialValues={{ luck_value: 100, status: 1, total: 1, remainder: 1, ...record }}
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
            <ProFormItem valueType="image" label="奖品图片" name="image">
                <div className={styles.prizeImage}>
                    <img src={prizeImg} />
                </div>
            </ProFormItem>
            <ProFormSelect
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                ]}
                placeholder="请选择奖品"
                request={prizeEnumList}
                width="md"
                name="prize_id"
                label='奖品'
                fieldProps={{
                    onChange: async (prize_id: number) => {
                        if (Object.prototype.toString.call(prize_id) !== '[object Number]') return setPrizeImg("");
                        if (httpCache.current[prize_id]) {
                            setPrizeImg(httpCache.current[prize_id].image);
                            return
                        }
                        const { data } = await prizeInfo({
                            id: prize_id
                        })
                        if (!data) return setPrizeImg("");
                        const prize = data as Prize
                        let url: string = prize?.image || "";
                        setPrizeImg(url);
                        httpCache.current[prize_id] = prize;
                    }
                }}
            />
            <ProFormSelect
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                ]}
                placeholder="请选择奖品级别"
                request={prizeGradeEnumList}
                width="md"
                name="grade_id"
                label='奖品级别'
            />
            <ProFormDigit
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                    {
                        pattern: /^[0-9]*$/,
                        message: '请填写数字',
                    },
                ]}
                width="md"
                name="luck_value"
                label='幸运值'
            />
            <ProFormDigit
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                    {
                        pattern: /^[0-9]*$/,
                        message: '请填写数字',
                    },
                ]}
                width="md"
                name="total"
                label='总数量'
            />
            <ProFormDigit
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                    {
                        pattern: /^[0-9]*$/,
                        message: '请填写数字',
                    },
                ]}
                width="md"
                name="remainder"
                label='剩余数量'
            />
            <ProFormSelect
                rules={[
                    {
                        required: true,
                        message: '必填项',
                    },
                ]}
                options={[{ label: "启用", value: 1 }, { label: "禁用", value: 0 }]}
                width="md"
                name="status"
                label='奖品状态'
            />
        </ModalForm>
    );
}

export default PrizesPoolModal;