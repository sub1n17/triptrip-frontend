jest.mock('antd', () => {
    const antd = jest.requireActual('antd');

    const Modal = ({ title, children, onOk, onCancel }: any) => {
        return (
            <div role="modal-submit">
                <div>{title}</div>
                <div>{children}</div>
                <button onClick={onOk}>OK</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        );
    };

    return {
        ...antd,
        Modal,
    };
});
