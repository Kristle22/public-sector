function ComRow({ row }) {
  console.log(row);
  return (
    <>

      <ul>

        {row.status === 1 && row.coms.slice(0, -5).split('-^-^-,').map((c, i) =>
          <div>
            <p className="left"><i>{row.municipality}</i> <u>{row.activity}</u></p>
            <li key={i}>{c}</li>
          </div>)}
      </ul>
    </>
  );
}

export default ComRow;
