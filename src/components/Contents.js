import {useState, useEffect} from 'react';
import {Bar, Doughnut, Line} from 'react-chartjs-2';
import axios from 'axios';

const Contents = () => {

    const [confirmData , setConfirmData] = useState({});
    const [qurantinedData , setQurantinedData] = useState({});
    const [comparedData , setComparedData] = useState({});

    useEffect(()=>{
        const fetchEvents = async() =>{
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
            makeData(res.data);
        }
        const makeData = (items) =>{
            // items.forEach(item => console.log(item));
            const arr = items.reduce((acc,cur)=>{ //acc: 누적값 cur : 현재값
                const currentDate = new Date(cur.Date); //아 date 객체로 만든거 그래야 아래처럼 쓰는게 가능해지니까
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const date = currentDate.getDate();

                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recoverd = cur.Recovered;

                /*
                    얘들을 데리고 배열을 만들건데 만들기전에 데이터가 잘 들어가있는지
                    축척시키는 이 배열에 값이 들어가 잇는지 확인해볼거야
                    2020 10 28
                    2020 10 29
                    2020 10 30
                    연 , 월을 비교해서 없으면 새로 push 있다면 일을 비교해서 큰날짜것만 넣는 로직.
                */
                /*
                    es6 syntax 중에서
                    키와 배열이 같으면 year:year,
                    둘중 하나만 넣어도 됨 축약이 가능하다.
                */
                const finedItem = acc.find(a => a.year === year && a.month === month);

                if(!finedItem){ //맨첨엔 없으니까 바로들어가겟지
                    acc.push({
                        year,
                        month,
                        date,
                        confirmed,
                        active,
                        death
                    })
                }
                if( finedItem && finedItem.date < date){ //여기서 다 갈아 치움 01값을 02 날짜로 갈아치움
                    finedItem.active= active;
                    finedItem.death= death;
                    finedItem.confirmed= confirmed;
                    finedItem.recoverd= recoverd;
                    finedItem.date=date;
                    finedItem.year= year;
                    finedItem.month= month; 
                    /*
                        왜 findItem에 값을 업데이트 하는가?
                        const finedItem = acc.find(a => a.year === year && a.month === month);
                        여기서 선언을 하면서 findITem에 acc안에 들어가있는 아이템이 선택이 되어있기 때문에
                        아래에서 값을 바꾸더라도 acc의 값이 같이 적용이 된다.
                        -> 값 자체를 복사한게 아니라 아이템의 주소를 담았기 때문에!

                        find()?
                        주어진 판별 함수를 만족하는 첫번째 요소의 값을 반환한다.
                        1월에 만족하는거
                        2월에 만족하는거
                        ...
                        12월에 만족하는거 
                        12개의 배열 완성

                        일단 findItem은 코로나 정보를 반복문을 돌리는데  여기서 잘 보셔야 하는 부분이

                        acc.push({...})

                        부분입니다.  acc에 해당 년도의 달을 가진 아이템이 없으면 acc에 푸쉬를 해주게 만들었는데
                        "해당 년도의 달을 가진 아이템"  이게 바로 findItem이 하는 역할이고,
                         const finedItem = acc.find(a => a.year === year && a.month === month);
 
                        findItem에 acc중 조건을 만족하는 아이템을 담았고
                            (  이때 변수는 그 값 자체를 복사한게 아니라 그 값이 가르키는 아이템의 주소를 담은 겁니다. 
                            그렇기 때문에 findItem에 값을 바꿔도, acc의 해당 아이템의 값이 바뀌는 것이지요 )
                     */
                    
                }
                return acc; //업데이트 된 cur를 넘김
            },[])
            // console.log(arr);

            const labels = arr.map(a=>`${a.month}월`);
            /**
             * map 
             * 중괄호 return 필요!!
             * 한줄은 노필요~~
             */
            setConfirmData({
                labels,
                datasets : [
                    {
                        label : "국내 누적 확진자",
                        backgroundColor : "salmon",
                        fill:true,
                        data : arr.map(a=>a.confirmed)
                    }
                 ]
            });
            setQurantinedData({
                labels,
                datasets : [
                    {
                        label : "월별 격리자 현황",
                        borderColor : "green",
                        fill:false,
                        data : arr.map(a=>a.active)
                    }
                 ]
            });
            const last = arr[arr.length -1];
            console.log(last);
            setComparedData({
                labels : ["확진자", "격리해제", "사망"],
                datasets : [
                    {
                        label : "누적 확진, 해제, 사망 비율",
                        backgroundColor : ["#ff3d67", "#059bff","#ffc233"],
                        borderColor : ["#ff3d67", "#059bff","#ffc233"],
                        fill:false,
                        data : [last.confirmed,last.recoverd,last.death]
                    }
                 ]
            });
        }
        fetchEvents();
    },[]);
    return (
        <section>
                <h2>국내 코로나 현황</h2>
                <div className="contents">
                    <div>
                        <Bar
                            data={confirmData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "누적 확진자 추이",
                                        fontSize:16
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    }
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Line
                            data={qurantinedData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "월별 격리자 현황",
                                        fontSize:16
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    }
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Doughnut
                            data={comparedData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text : `누적 확진, 해제, 사망 (${new Date().getMonth() + 1}월 현재)`,
                                        fontSize:16
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    },
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    weight : 1
                                }
                            }}
                        />
                    </div>
                </div>
        </section>
    )
}

export default Contents;