import { DeleteTwoTone, DownOutlined, EditTwoTone } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { ItemType } from 'antd/lib/menu/hooks/useItems';

const operationList = (): ItemType[] => {
    return [
        {
            key: 'edit',
            itemIcon: <EditTwoTone twoToneColor='#245cfc'></EditTwoTone>,
            label: '编辑'
        },
        {
            key: 'delete',
            itemIcon: <DeleteTwoTone twoToneColor='#ce2e3f'></DeleteTwoTone>,
            danger: true,
            label: '删除',
        },
    ]
}

type MoreBtnProps = {
    onEdit: (current: any) => void;
    onDel: (current_id: number) => void;
    current: any;
}

const MoreActionBtn: React.FC<MoreBtnProps> = (props) => {
    const { onEdit, onDel, current } = props;

    const editAndDelete = (key: string | number, currentItem: any) => {
        if (key === 'edit') {
            onEdit(currentItem);
        }
        else if (key === 'delete') {
            onDel(currentItem.id)
        }
    };

    return (
        <Dropdown
            overlay={
                <Menu
                    onClick={({ key }) => editAndDelete(key, current)}
                    items={operationList()}
                >
                </Menu>
            }
        >
            <a href="#!" onClick={(e) => { e.preventDefault() }}>
                操作 <DownOutlined />
            </a>
        </Dropdown>
    );
}

export default MoreActionBtn;