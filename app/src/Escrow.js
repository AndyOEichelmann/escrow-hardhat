export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  status,
  handleApprove,
  activeAcount
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} SepoliaETH </div>
        </li>
        <>
        { !status // verify the status (approved / not aproved) of the contract to change the dispyd information
          ? activeAcount === arbiter.toLowerCase()
            // verifyes if the acunt is the arbiter to grant acces for apruval btn
            ? <div className="button" id={address}
                onClick={(e) => {
                  e.preventDefault();
        
                  handleApprove();
                }}>
                  {console.log('active account:',activeAcount)}
                  {console.log('arbiter account:',arbiter.toLowerCase())}
                Approve
              </div>
            :
              <div className="waiting" id={address}>
                Waiting to be approved ...
              </div>
          : <div className="complete" id={address}>
              ✓ It's been approved!
            </div> 
        }
        </>
      </ul>
    </div>
  );
}
