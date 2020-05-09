import React, { useEffect, useState, createContext } from 'react';
import Header from "../header/header";
import { makeStyles } from '@material-ui/core/styles';

import DynamicCard from '../dynamicCard/dynamicCard';
import NewProjectDialog from '../newProjectDialog/newProjectDialog';
import ProjectDisplay from '../projectDisplay/projectDisplay';
import Loading from '../loading/loading';
import * as API from '../connectionHandler/connectionHandler';
import SnackbarOverlay from '../snackbar/snackbar';
import AdminOptions from "../layouts/adminOptions/adminOptions";

export const UserContext = createContext();

const useStyles = makeStyles((theme) => ({
  flexCards: {
    display: 'flex',
    flexDirection: 'row',
    padding: '25px',
    margin: 'auto',
    flexWrap: 'wrap',
    alignSelf: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: '75px',
  },
  mainPage: {
    backgroundColor: 'lightgray',
    height: '100vh',
    overflowY: 'auto',
  },
}));

const SinglePage = () => {

  const classes = useStyles();

  const [errorMessage, setErrorMessage] = useState("");
  const [projects, setProjects] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [showAdminOptions, setShowAdminOptions] = useState(false)
  const [projectData, setProjectData] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [showNewProjectDialog, setNewProjectDialogViewState] = useState(false);


  const [user, setUser] = useState(null);


  useEffect(() => {
    API.getUserData(setErrorMessage, setUser);
  }, [])

  useEffect(() => {
    if (user) {
      switch (true) {
        case user.roles.includes("Admin"):
          API.getContracts(setErrorMessage, setContracts);
        case user.roles.includes("Verkäufer"):
          API.getProjects(setErrorMessage, setProjects);
          break;
        case user.roles.includes("Projektleiter"):
          API.getUserProjects(setErrorMessage, setProjects);
        case user.roles.includes("Mitarbeiter"):
          API.getUserContracts(setErrorMessage, setContracts);
          break;
        default:
          setErrorMessage("User hat keine Rollen. Kontaktiere deinen Administrator!");
      }
    }
  }, [user]);

  const toggleAdminOption = () => {
    setShowAdminOptions(!showAdminOptions);
  }

  const emptyErrorMessage = () => {
    setErrorMessage("");
  }

  const openNewProjectDialog = () => {
    API.getCustomers(setErrorMessage, setCustomerData);
    setNewProjectDialogViewState(true);
  }

  const closeNewProjectDialog = () => {
    setNewProjectDialogViewState(false);
    setCustomerData([]);
  }

  const submitNewProject = (newProjectData) => {
    setNewProjectDialogViewState(false);
    API.submitNewProject(newProjectData, setErrorMessage, function () {
      return API.getProjects(setErrorMessage, setProjects);
    });
  }

  
  let addProjectCard = [];
  addProjectCard.push(
    <DynamicCard
      hidden={
        user && !(user.roles.includes("Verkäufer") || user.roles.includes("Admin"))}
      key={'0-projectCard'}
      projectName={'Neues Projekt'}
      description={'Hier eine neues Projekt erstellen!'}
      buttonName={'Neues Projekt hinzufügen...'}
      onClick={openNewProjectDialog}
    />
  );

  const createContent = () => {
    if (showAdminOptions) {
      return <AdminOptions setErrorMessage={setErrorMessage} />
    } else if (showNewProjectDialog) {
      return <NewProjectDialog
        show={showNewProjectDialog}
        customers={customerData}
        onCancel={closeNewProjectDialog}
        onSubmit={submitNewProject}
      />
    } else if (projectData) {
      return <ProjectDisplay projectData={projectData} onError={setErrorMessage} onClose={() => setProjectData(null)} />
    } else if (projects || contracts) {
      if (projects) {
        addProjectCard = addProjectCard.concat(
          projects.map((entry, index) =>
            <DynamicCard
              key={(index + 1) + "-projectCard"}
              onClick={() => setProjectData(entry)}
              projectName={'Projekt ' + entry.name}
              description={entry.description} />
          ))
      }
      if (contracts) {
        addProjectCard = addProjectCard.concat(
          contracts.map((entry, index) =>
            <DynamicCard
              key={(index + 1) + "-projectCard"}
              onClick={() => setProjectData(entry)}
              projectName={'Auftrag ' + entry.name}
              description={entry.description} />
          ))
      }
      return addProjectCard;
    } else {
      return <Loading key={"home-loading-key"} text={"Lade Daten..."} />
    }
  }

  const content = createContent();

  const snackbar =
    <SnackbarOverlay
      show={errorMessage !== ""}
      text={errorMessage}
      severity="error"
      onClose={emptyErrorMessage}
    />

  return (
    <div className={classes.mainPage}>
      <UserContext.Provider value={user}>
        <Header onError={setErrorMessage} onSettingsClick={toggleAdminOption} />
        <div className={classes.content}>
          <div className={classes.flexCards}>
            {content}
          </div>
        </div>
        {snackbar}
      </UserContext.Provider>
    </div>
  );
};
export default SinglePage;