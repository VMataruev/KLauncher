import img from "../../../assets/play-btn-img.png"

function Home(): React.JSX.Element {

  return (
    <>
      <div className="main_wrapper">
        <div className="header">
          {/* <div className="link_box">
            <a href="" >Играть</a>
            <div className="page-indicator page-active"></div>
          </div>
          <div className="link_box">
            <a href="">Установки</a>
            <div className="page-indicator page-deactive"></div>
          </div>
          <div className="link_box">
            <a href="">Моды</a>
            <div className="page-indicator page-deactive"></div>
          </div>
          <div className="link_box">
            <a href="">Настройки</a>
            <div className="page-indicator page-deactive"></div>
          </div> */}
        </div>



        <div className="body">
          
        </div>



        <div className="basement">
          <select name="installations" id="" className="installations">
            <option value="">1.21.10</option>
            <option value="">1.20.0</option>
            <option value="">1.19.0</option>
          </select>

          <div className="play">
            <button className="play_btn"></button>
            <img src={img} alt="" />
          </div>

          <div className="user_info">KillerBunny</div>
        </div>
      </div>
    </>
  )
}

export default Home
