const form =document.querySelector(".add");
const incomeList=document.querySelector("ul.income-list");
const expensesList=document.querySelector("ul.expense-list");
const balance=document.getElementById("balance");
const income=document.getElementById("income");
const expense=document.getElementById("expense");


let transactions=localStorage.getItem("transactions") !==null ? JSON.parse(localStorage.getItem("transactions")): [];

function updatedStatics(){

    const updatedIncome=transactions
                                  .filter(transaction => transaction.amount > 0)
                                  .reduce((total, transaction)=> total += Number(transaction.amount), 0);
                                  
  console.log(updatedIncome);
    const updatedExpenses=transactions
                                      .filter(transaction => transaction.amount < 0)
                                      .reduce((total, transaction)=> total += Number(Math.abs(transaction.amount)), 0);
      
                                      console.log(typeof(updatedExpenses));
      updatedBalance = updatedIncome - updatedExpenses;                                
      balance.textContent= updatedBalance;
      income.textContent = updatedIncome;
      expense.textContent = updatedExpenses;
  }
  
  updatedStatics();


function addTranscationTemplate(id, source, amount, time){
    return (
        ` <li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>
        `
    )
}

function addTranscationDom(id, source, amount, time){   

    if(amount > 0){
        incomeList.innerHTML += addTranscationTemplate(id, source, amount, time)
    }else{
        expensesList.innerHTML += addTranscationTemplate(id, source, amount, time)
    }

}

function addTranscation(source, amount){
    const time=new Date();
    const transaction={
        id: Math.floor(Math.random()*1000),
        source,
        amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    }
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    addTranscationDom(transaction.id, source, amount, transaction.time);
}

form.addEventListener("submit", event=>{
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value.trim() === ""){
        return alert("Please add proper value")
    }
    addTranscation(form.source.value.trim(), form.amount.value);
    updatedStatics();
    form.reset();
})

function getTransactions(){
    transactions.forEach(transaction =>{
        if(transaction.amount > 0){
            incomeList.innerHTML +=addTranscationTemplate(transaction.id, transaction.source, transaction.amount, transaction.time)
        }else{
            expensesList.innerHTML +=addTranscationTemplate(transaction.id, transaction.source, transaction.amount, transaction.time)
        }
    })

}

getTransactions();

function deleteTransaction(id){
    transactions = transactions.filter(transaction => {
        console.log(transaction.id, id);
       return transaction.id !== id;
    })
    updatedStatics();
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

incomeList.addEventListener("click", event=>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id))
    }
})

expensesList.addEventListener("click", event =>{
    if(event.target.classList.contains("delete")){
      event.target.parentElement.remove()
      deleteTransaction(Number(event.target.parentElement.dataset.id))
    }
});

