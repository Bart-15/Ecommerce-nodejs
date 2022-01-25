const Order = require('../models/order');
const OrderItem = require('../models/order-items');


const createOrder = async (req, res) => {
   const orderItemsId = Promise.all(req.body.orderItems.map(async item => {
       let newOrderItem = new OrderItem({
           quantity: item.quantity,
           product: item.product
       })
       newOrderItem = await newOrderItem.save();
       return newOrderItem._id
   }))

   const orderIds = await orderItemsId;
   const totalPrices = await Promise.all(orderIds.map(async (item) => {
        const orderItem = await OrderItem.findById(item).populate('product','price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice; 
   }))

   const totalPrice = totalPrices.reduce((a,b) => a +b + 0);

   const order = new Order({
       orderItems: orderIds,
       shippingAddress1:req.body.shippingAddress1,
       shippingAddress2:req.body.shippingAddress2,
       city:req.body.city,
       zip:req.body.zip,
       country:req.body.country,
       phone:req.body.phone,
       totalPrice:totalPrice,
       user:req.body.user
   })

   await order.save();  
   res.status(200).json({
       success: true,
       order
   })
}

const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name',).sort({'dateOrdered':-1})
    try{
        if(!orders){
            return res.status(404).json({
                success: false,
                messagee:"No orders"
            })
        }

        res.status(200).json(orders)
    } catch(err){
        res.status(500).json({
            success: false,
            message:"Can't get orders."
        })
    }
}

const getSingleOrder = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path:'orderItems',
                    populate :{
                        path:'product',
                            populate : 'category'
                    }
            })
        if(!order) {
            return res.status(404).json({
                success:false,
                message:"Order not found."})
        }

        res.status(200).json(order)

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Can't get order"})
    }
}

const updateOrder = async (req, res) => {
    const updateStatus = {
        status:req.body.status
    }
    try{
        const order = await Order.findByIdAndUpdate({_id:req.params.id}, updateStatus, {returnOriginal:false})
        if(!order) {
            res.status(400).json({
                message:"Order not found"
            })
        }

        await order.save();
        res.status(200).json(order)

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Can't update order."
        })
    }
}


const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if(!order) {
            return res.status(404).json({
                success:false,
                message:"Order not found"
            })
        }
        
         await order.orderItems.map(async orderItem => {
            await OrderItem.findByIdAndRemove(orderItem)
        })


        res.status(200).json({
            success:true,
            message:"Order deleted successfully"
        })

    }catch(err) {
        res.status(500).json({
            success:false,
            message:"Error deleting order."
        })
    }
}

const countOrders = async (req, res) => {
    try{
        const order = await Order.countDocuments();
        if(!order) {
            return res.status(400).json({
                success: false
            })
        }
        
        res.status(200).json({
            orderCount: order
        })
        

    } catch(err){
        res.status(500).json({
            success:false,
            message: "Can't get orders"
        })
    }
}

const totalSales = async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            {$group: {_id:null, totalsales:{$sum : '$totalPrice'}}}
        ])
        if(!totalSales) {
            res.status(400).json({
                success: false,
                message:"The order sales cannot be generated."
            })
        }

        res.status(200).json({
            totalSales: totalSales.pop().totalsales
        })

    }catch(err){
        res.status(500).json({mssage:"Server unavailable"})
    }
}

const userOrders= async (req, res) => {
    try {
        const userOrderList = await Order.find({user:req.params.userid})
                .populate({
                    path:'orderItems',
                        populate :{
                            path:'product',
                                populate : 'category'
                        }
                })    
        if(!userOrderList) return res.status(404).json({success:false, messgae:"No orders"})

        res.status(200).json(userOrderList)
    }catch(err) {
        res.status(500).json({message:"Can't get users order"})
    }

}
module.exports = {
    createOrder,
    getOrders,
    getSingleOrder,
    updateOrder, 
    deleteOrder,
    countOrders,
    totalSales,
    userOrders
}