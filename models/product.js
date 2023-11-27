'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: DataTypes.UUID,
    category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code_product: DataTypes.STRING,
    productsImages: DataTypes.STRING,
    slug: DataTypes.STRING,
    price: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    detail: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  });
  return Product;
};