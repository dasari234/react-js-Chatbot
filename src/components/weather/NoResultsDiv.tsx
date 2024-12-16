const NoResultsDiv = () => {
    return (
      <div className="no-results">
        <h3 className="title">Something went wrong!</h3>
        <p className="message">We&apos;re unable to retrieve the weather details. Enure you&apos;ve entered a valid city or try again later.</p>
      </div>
    );
  };
  
  export default NoResultsDiv;