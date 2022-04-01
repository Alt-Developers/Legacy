const ExistingPlayerItem = (props) => {
  return (
    <li>
      <h1>{props.name}</h1>
      <p>{props.tier}</p>
    </li>
  );
};

export default ExistingPlayerItem;
