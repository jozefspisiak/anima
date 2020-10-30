import { useRouter } from "next/router";
import * as R from "ramda";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { isFilterActive } from "../helpers/utils";

const filterList = ["magical", "physical"];

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function Filters() {
  const router = useRouter();
  const classes = useStyles();

  const { query } = router;

  const handleClick = (filter) => {
    const newQuery = isFilterActive(filter, query)
      ? R.omit([filter], query)
      : { ...query, [filter]: "" };
    console.log(newQuery);
    router.push({ query: newQuery });
  };

  return (
    <Container fixed className={classes.root}>
      {filterList.map((filter) => (
        <Button
          key={filter}
          variant="contained"
          color={isFilterActive(filter, query) ? "secondary" : "primary"}
          onClick={(ev) => handleClick(filter)}
        >
          {filter}
        </Button>
      ))}
    </Container>
  );
}

export default Filters;
