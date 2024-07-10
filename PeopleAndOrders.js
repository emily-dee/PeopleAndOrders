// Reports on people collection:


// 1. Average age
db.people.aggregate([{$group: {_id: null, averageAge: {$avg: '$age'}}}, {$project: {_id: false, averageAge: true}}]);


// 2. Average age by gender
db.people.aggregate([{$group: {_id: '$gender', averageAge: {$avg: '$age'}}}]);


// 3. Number of people by gender
db.people.aggregate([{$group: {_id: '$gender', count: {$sum: 1}}}]);


// 4. 3 oldest people
db.people.aggregate([{$sort: {age: -1}}, {$limit: 3}, {$project: {first_name: true, last_name: true, age: true, _id: false}}]);


// 5. 5 youngest people, display only their names as one value (first + " " + last) and their ages
db.people.aggregate([{$sort: {age: 1}}, {$limit: 5}, {$project: {fullName: {$concat: ['$first_name', ' ', '$last_name']}, age: true, _id: false}}]);


// 6. Average number of children
db.people.aggregate([{$group: {_id: null, avgChildren: {$avg: {$size: '$children'}}}}]);


// 7. Name and age of children in Michigan who are under age ten
db.people.aggregate([{$unwind: '$children'}, {$match: {'children.age': {$lt: 10}, state: 'Michigan'}}, {$project: {'children.age': true, 'children.name': true, _id: false}}])


// 8. Average age of child by state, sorted with oldest first
db.people.aggregate([{$unwind: '$children'}, {$group: {_id: '$state', averageAge: {$avg: '$children.age'}}}, {$sort: {averageAge: -1}}])


// Reports on orders collection:


// 9. Find the total dollar amount of all sales ever. Use the total field.
db.orders.aggregate([{$group: {_id: null, totalSum: {$sum: '$total'}}}]);


// 10. Find the total dollar amount of sales on 2017-05-22. Use the total field.
db.orders.aggregate([{$match: {date: '2017-05-04'}}, {$group: {_id: null, totalSum: {$sum: '$total'}}}]);


// 11. Find the date with the greatest number of orders. Include the date and the number of orders.
db.orders.aggregate([{$project: {numOrders: {$size: '$items'}, date: true, _id: false}}, {$sort: {numOrders: -1}}, {$limit: 1}]);


// 12. Find the date with the greatest total sales. Include the date and the dollar amount for that day.
db.orders.aggregate([{$group: {_id: '$date', dateSum: {$sum: '$total'}}}, {$sort: {dateSum: -1}}, {$limit: 1}, {$project: {dateSum: true, date: '$_id', _id: false}}]);


// 13. Find the top three products that have had the greatest number sold. Include product name and number sold.
db.orders.aggregate([{$unwind: '$items'}, {$group: {_id: '$items.product', count: {$sum: '$items.count'}}}, {$project: {product: '$_id', count: true, _id: false}}, {$sort: {count: -1}}, {$limit: 3}]);


// 14. Find the top item that has the greatest revenue (number sold * price). Include product name and dollar amount of sales.
db.orders.aggregate([{$unwind: '$items'}, {$group: {_id: '$items.product', totalProduct: {$sum: '$items.count'},  revenue: {$sum: {$multiply: ['$items.price', '$items.count']}}}}, {$project: {revenue: true}}, {$sort: {revenue: -1}}, {$limit: 1}]);