//настройки пояса астероидов
const aster_db = {
    count: 50,  //общее число астероидов деленное на 4
    radius: 8,  //радиус орбиты, среднее между start_x Марса и Юпитера
    diam: 0.1,  //макс диаметр одной сферы
    speed: -0.002,
}

//база данных по планетам
const solar_db = [
    {
        name: 'sun',
        texture: 'img/sun.jpg',
        size: 3,
        start_x: 0,
        speed: 0,
        rotation: 0.002,
        companions: 0,
        rings: null
    },
    {
        name: 'mercury',
        texture: 'img/mercury.jpg',
        size: 0.2,
        start_x: 3,
        speed: 0.02,
        rotation: 0.005,
        companions: 0,
        rings: null
    },
    {
        name: 'venus',
        texture: 'img/venus.png',
        size: 0.3,
        start_x: 4,
        speed: 0.04,
        rotation: 0.005,
        companions: 0,
        rings: null
    },
    {
        name: 'earth',
        texture: 'img/earth.jpg',
        size: 0.4,
        start_x: 5,
        speed: 0.03,
        rotation: 0.002,
        companions: 0,
        rings: null
    },
    {
        name: 'mars',
        texture: 'img/mars.png',
        size: 0.35,
        start_x: 6,
        speed: 0.01,
        rotation: 0.003,
        companions: 0,
        rings: null
    },
    {
        name: 'jupiter',
        texture: 'img/jupiter.jpg',
        size: 2.2,
        start_x: 10,
        speed: 0.04,
        rotation: 0.0022,
        companions: 0,
        rings: null
    },
    {
        name: 'saturn',
        texture: 'img/saturn.png',
        size: 1.8,
        start_x: 12,
        speed: 0.02,
        rotation: 0.004,
        companions: 0,
        rings: 'img/rings.png'
    },
    {
        name: 'uran',
        texture: 'img/uran.jpg',
        size: 1.2,
        start_x: 14,
        speed: 0.05,
        rotation: 0.002,
        companions: 0,
        rings: null
    },
    {
        name: 'neptun',
        texture: 'img/neptun.png',
        size: 1.2,
        start_x: 15.5,
        speed: 0.03,
        rotation: 0.003,
        companions: 0,
        rings: null
    }
]