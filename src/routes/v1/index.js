const express = require("express");
const authRoute = require("./Auth.route");
const adminUserRoute = require("./User.route");
const adminCustomRoute = require("./CustomField.route");
const mediaFileRoute = require("./Upload.route");
const menuRoute = require("./Menu.route");
const categoryRoute = require("./Category.route");
const vehicleTypeRoute = require("./VehicleType.route");
const brandRoute = require("./Brand.route");
const featureRoute = require("./Feature.route");
const couponRoute = require("./Coupon.route");
const vendorRoute = require("./Vendor.route");
const vehicleRoute = require("./Vehicle.route");
const webRoute = require('./web.route');
const orderRoute = require('./Order.route');
const paymentRoute = require('./Payment.route');
const dashboardRoute = require('./Dashboard.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: adminUserRoute,
  },
  {
    path: "/custom-fields",
    route: adminCustomRoute,
  },
  {
    path: "/uploads",
    route: mediaFileRoute,
  },
  {
    path: "/menus",
    route: menuRoute,
  },
  {
    path: "/categories",
    route: categoryRoute,
  },
  {
    path: "/vehicle-types",
    route: vehicleTypeRoute,
  },
  {
    path: "/brands",
    route: brandRoute,
  },
  {
    path: "/features",
    route: featureRoute,
  },
  {
    path: "/coupons",
    route: couponRoute,
  },
  {
    path: "/vendors",
    route: vendorRoute,
  },
  {
    path: "/vehicles",
    route: vehicleRoute,
  },
  {
    path: "/web",
    route: webRoute,
  },
  {
    path: "/orders",
    route: orderRoute,
  },
  {
    path: "/payments",
    route: paymentRoute,
  },
  {
    path: "/dashboard",
    route: dashboardRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
