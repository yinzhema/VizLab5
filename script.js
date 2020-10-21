let type="stores"
let sort=true

const margin = ({top: 20, right: 20, bottom: 20, left: 20})
const width=750-margin.left-margin.right,
	  height=500-margin.top-margin.bottom

const svg=d3.select('.chart').append('svg')
		.attr('width',width+margin.left+margin.right)
		.attr('height',height+margin.top+margin.bottom)
		.append('g')
		.attr('transform','translate('+margin.left+','+margin.top+')')

const xAxisBand=d3.scaleBand()
		.range([50,width])
		.paddingInner(0.1)

const yScale=d3.scaleLinear()

const storeScale=d3.scaleLinear()

svg.append('g')
		.attr('class','x-axis')
		.attr("transform", `translate(0, ${height})`)

svg.append('g')
		.attr('class','y-axis')
		.attr('transform',`translate(50,0)`)

svg.append('text')
		.attr('class','y-title')
		.attr('x',0)
		.attr('y',-5)
		.text('Stores')

function update(data,type,sorted){
	if (sorted){
		data.sort((a,b)=>a[type]-b[type]).reverse()
	} else{
		data.sort((a,b)=>a[type]-b[type])
	}

	xAxisBand.domain(data.map(d=>d.company))

	let storeMax=d3.max(data,d=>d[type]);

	storeScale.domain([0,storeMax])
		.range([0,height])
	
	yScale.domain([0,storeMax])
		.range([height,0])

	const bars=svg.selectAll('.bar')
		.data(data)

	bars.enter()
		.append("rect")
		.attr('x',function(d,i){
			return 0
		})
		.attr('y',function(d,i){
			return height-storeScale(d[type])
		})
		.attr('width',0)
		.attr('height',function(d){
			return 0
		})
		.merge(bars)
		.transition()
      	.delay(200)
		.duration(1000)
		.attr('class','bar')
		.attr('x',function(d,i){
			return xAxisBand(d.company)
		})
		.attr('y',function(d,i){
			return height-storeScale(d[type])
		})
		.attr('width',xAxisBand.bandwidth())
		.attr('height',function(d){
			return storeScale(d[type])
		})
		.attr('fill','skyblue')

	bars.exit()
		.attr('fill','white')
		.attr('opacity',0)
		.remove();
		

	const xAxis=d3.axisBottom()
		.scale(xAxisBand)
	
	const yAxis=d3.axisLeft()
		.scale(yScale)

	svg.select('.x-axis')
		.call(xAxis)
	
	svg.select('.y-axis')
		.call(yAxis)
	
	svg.select('.y-title')
		.text((d)=>{
			if (type=='stores'){
				return 'Stores'
			} else{
				return 'Billion USD'
			}
		})

}


d3.csv('coffee-house-chains.csv',d3.autoType).then(data=>{
	update(data,type,sort);

	d3.select('#sort').on('click',()=>{
		sort=!sort
		console.log(sort)
		update(data,type,sort)
	})
	d3.select('#group-by').on('change',(event)=>{
		type=event.target.value;
		update(data,type,sort);
	})
	
})

