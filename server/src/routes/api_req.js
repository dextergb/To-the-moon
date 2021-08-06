import express from 'express';
import models from '../models/index.js';

const router = express.Router();

router.get('/watchlist/:id/:symbol', async (req, res) => {
   const userId = req.params.id
   const symbol = req.params.symbol

   const watchlists = await models.Watchlist.find().where({ user: userId, symbol: symbol})
   if (watchlists.length) {
      res.json(watchlists)
   } else {
      res.json(null);
   }
})

router.post('/watchlist', async (req, res) => {
   const { symbol, user } = req.body;
   const user1 = await models.User.findByLogin(user.email)

   user1.save(function (err) {
      if (err) res.status(500).json(err);
    
      const watchlist = new models.Watchlist({
        symbol: symbol,
        user: user1._id
      });
    
      watchlist.save(function (err) {
        if (err) return res.status(500).json(err);
        user1.watchlist.push(watchlist);
        user1.save();
        res.json('watchlist details added successfully')
      });
   });
});

router.post('/watchlist/delete', async (req, res) => {
   const { symbol, user } = req.body;

   const status = await models.Watchlist.deleteMany({ symbol: symbol, user: user['_id'] });
   console.log("status", status);
   res.json('watchlist removed successfully');
   
});

router.get('/', async (req, res) => {
   let watchlist = await models.Watchlist.findOne({symbol: 'AAPL'})
      .populate('user')
   res.json(watchlist)
});

router.post('/buy', async (req, res) => {
   console.log('buy request received');

   const { symbol, quantity, action, user, price } = req.body;

   const user1 = await models.User.findByLogin(user.email);

   if (user1.balance < (price * quantity)) {
      return res.status(500).json('insufficient funds');
   }

   const order = new models.Order({
      symbol: symbol,
      price: price,
      shares: quantity,
      action: action,
      open: true,
      user: user1
   });

   order.save((err) => {
      if (err) return res.status(500).json(err);
      user1.balance = user1.balance - (price * quantity)

      if (!user1.holdings.get(symbol)) {
         user1.holdings.set(symbol, quantity);
      } else {
         user1.holdings.set(symbol, user1.holdings.get(symbol) + quantity)
      }
      user1.save(() => {
         return res.json('order executed!')
      })
   })
});

router.post('/sell', async (req, res) => {
   console.log('sell request received');

   const { symbol, quantity, action, user, price } = req.body;

   const user1 = await models.User.findByLogin(user.email);

   if (!user1.holdings.get(symbol) || user1.holdings.get(symbol) < quantity) {
      return res.status(500).json(`insufficient shares of ${symbol}`);
   }

   const order = new models.Order({
      symbol: symbol,
      price: price,
      shares: quantity,
      action: action,
      open: false,
      user: user1
   });

   order.save((err) => {
      if (err) return res.status(500).json(err);
      user1.balance = user1.balance + (price * quantity)

      user1.holdings.set(symbol, user1.holdings.get(symbol) - quantity)
      
      user1.save(() => {
         return res.json('order executed!')
      })
   })
});

router.post('/short', async (req, res) => {
   res.json("hello");
});

router.post('/cover', async (req, res) => {
   res.json("hello");
});

export default router;