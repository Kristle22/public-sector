function ComRow({ row }) {
  console.log(row);
  return (
    <ul>
      {row.status === 1 &&
        <div>
          <p className="left"><i>{row.municipality}</i> <u>{row.activity}</u></p>
          <li key={row.id}>{row.com}</li>
        </div>}
    </ul>
  );
}

export default ComRow;
