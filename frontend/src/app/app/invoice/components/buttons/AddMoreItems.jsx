export default function AddMoreItems({ link, isIssuedOrPaid }) {
    return (
        <div onClick={() => !isIssuedOrPaid && link()} className="add-more-item-box border-1 rounded-xs border-dashed px-5 py-5 w-full m-auto">
            <div className="m-auto max-w-screen-xl">
                <div className="max-w-screen-sm m-auto text-center">
                    <div><i className="plus-icon"></i></div>
                    <div><span>Click to add new item</span></div>
                </div>
            </div>
        </div>
    )
}