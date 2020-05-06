import React, {useEffect, useState} from 'react';
import ProductTable from "./productTable";
import Button from "@material-ui/core/Button";
import * as API from "../../../connectionHandler/connectionHandler";
import AddProductDialog from "./addProductDialog";
import AddNpkProductDialog from "./addNpkProductDialog";
import {makeStyles} from "@material-ui/core/styles";


const ProductOverview = ({ setErrorMessage, onCancel, onSubmit, show, ...props }) =>  {

  const [showNewProductDialog, setNewProductDialogViewState] = useState(false);
  const [showNewNpProductDialog, setNewNpkProductDialogViewState] = useState(false);
  const [productData, setProductData] = useState([]);
  const buttonName = "Neuen Artikel hinzufügen";
  const buttonNpkName = "Neuen NPK Artikel hinzufügen";
  const [products, setProducts] = useState([]);
  const [npks, setNpks] = useState([]);

  const useStyles = makeStyles({
    button:{
      marginRight: '10px',
      marginBottom: '10px'
    }
  });

  const classes = useStyles();

  const closeNewProductDialog = () => {
    setNewProductDialogViewState(false);
    setProductData([]);
  }

  const closeNewNpkProductDialog = () => {
    setNewNpkProductDialogViewState(false);
    setProductData([]);
  }

  const getProducts = () => {
    API.getProducts(setErrorMessage, setProducts);
  }

  const loadNewProducts = () => {
    closeNewProductDialog();
    closeNewNpkProductDialog();
    getProducts();
  }

  const openNewProductDialog = () => {
    setNewProductDialogViewState(true);
  }

  const openNewNpkProductDialog = () => {
    setNewNpkProductDialogViewState(true);
  }

/*  const submitNewArticle = (newArticleData) => {
    setNewProductDialogViewState(false);
    console.log(JSON.stringify(newArticleData));
    API.submitNewProduct(newArticleData, setErrorMessage, getProducts);
  }*/

  const addNewProductDialog =
      <AddProductDialog
          show={showNewProductDialog}
          articles={productData}
          onCancel={closeNewProductDialog}
          onSubmit={loadNewProducts}
          products={products}
          npks={npks}
          setNpks={setNpks}
      />

  const addNewNpkProductDialog =
      <AddNpkProductDialog
          show={showNewNpProductDialog}
          articles={productData}
          onCancel={closeNewNpkProductDialog}
          onSubmit={loadNewProducts}
          products={products}
          npks={npks}
          setNpks={setNpks}
      />

  return (
      <div >
        {addNewProductDialog}
        {addNewNpkProductDialog}

        <Button className={classes.button} variant="outlined" color="primary" disableElevation onClick={openNewProductDialog}>{buttonName}</Button>
        <Button className={classes.button} variant="outlined" color="primary" disableElevation onClick={openNewNpkProductDialog}>{buttonNpkName}</Button>
        <ProductTable npks={npks} setErrorMessage={setErrorMessage} setProducts={setProducts} products={products}/>
      </div>
  );
}

export default ProductOverview;