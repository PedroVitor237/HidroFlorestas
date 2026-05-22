export default function Workspace() {

    const temLab = false;

    if(!temLab) {
        return <span>Não há laboratórios disponíveis.</span>
    }

    return (
        <span>Há laboratórios disponíveis.</span>
    )
}